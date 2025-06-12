import json
import logging
import time
from typing import Any
import hashlib

import httpx
from fastapi import Request, HTTPException, status
from circuitbreaker import circuit

from gateway.core.config import settings
from gateway.utils.redis import redis_client, get_service_cache_key

logger = logging.getLogger("gateway.proxy.services")


@circuit(
    failure_threshold=settings.CIRCUIT_BREAKER_FAILURE_THRESHOLD,
    recovery_timeout=settings.CIRCUIT_BREAKER_RECOVERY_TIMEOUT,
    expected_exception=httpx.HTTPError
)
async def call_service(
    method: str,
    url: str,
    headers: dict[str, str] | None = None,
    params: dict[str, str] | None = None,
    json_data: dict[str, Any] | None = None,
    timeout: float = settings.SERVICE_TIMEOUT
) -> httpx.Response:
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method=method,
            url=url,
            headers=headers,
            params=params,
            json=json_data,
            timeout=timeout
        )
        response.raise_for_status()
        return response


class ServiceRequest:
    def __init__(
        self,
        service: str,
        path: str,
        method: str = "GET",
        headers: dict[str, str] | None = None,
        query_params: dict[str, str] | None = None,
        body: dict[str, Any] | None = None
    ):
        if service not in settings.SERVICES:
            raise ValueError(f"Service '{service}' not found")

        self.service = service
        self.path = path
        self.method = method.upper()
        self.headers = headers or {}
        self.query_params = query_params or {}
        self.body = body

        valid_methods = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]
        if self.method not in valid_methods:
            raise ValueError(f"Method '{method}' not valid")


class ServiceResponse:
    def __init__(
        self,
        status_code: int,
        body: Any,
        headers: dict[str, str] = None,
        from_cache: bool = False,
        service: str = "",
        path: str = "",
        method: str = "",
        process_time: float = 0.0
    ):
        self.status_code = status_code
        self.body = body
        self.headers = headers or {}
        self.from_cache = from_cache
        self.service = service
        self.path = path
        self.method = method
        self.process_time = process_time


def get_cache_relevant_headers(headers: dict[str, str]) -> dict[str, str]:
    cache_relevant_headers = [
        "x-user-id",
        "x-user",
        "x-user-role",
        "authorization",
        "accept-language",
        "x-tenant-id",
        "x-organization-id"
    ]

    return {
        key.lower(): value
        for key, value in headers.items()
        if key.lower() in cache_relevant_headers
    }


def get_enhanced_cache_key(
    service: str,
    path: str,
    method: str,
    query_params: dict[str, str],
    headers: dict[str, str]
) -> str:

    relevant_headers = get_cache_relevant_headers(headers)
    sorted_params = dict(sorted(query_params.items())) if query_params else {}
    sorted_headers = dict(sorted(relevant_headers.items())) if relevant_headers else {}

    cache_data = {
        "service": service,
        "path": path,
        "method": method,
        "params": sorted_params,
        "headers": sorted_headers
    }

    cache_string = json.dumps(cache_data, sort_keys=True, separators=(',', ':'))
    cache_hash = hashlib.md5(cache_string.encode()).hexdigest()

    return f"service_cache:{service}:{cache_hash}"


async def proxy_request(
    request: Request,
    service_request: ServiceRequest
) -> ServiceResponse:
    service = service_request.service
    path = service_request.path
    method = service_request.method
    base_url = settings.SERVICES[service]
    url = f"{base_url}{path}"

    start_time = time.time()

    headers = service_request.headers.copy()

    if hasattr(request.state, "request_id"):
        headers["X-Request-ID"] = request.state.request_id

    if hasattr(request.state, "user"):
        user = request.state.user
        headers["X-User"] = user.username
        headers["X-User-Role"] = user.role

    from_cache = False
    if method == "GET":
        cache_key = get_enhanced_cache_key(
            service,
            path,
            method,
            service_request.query_params,
            headers
        )

        cached_response = redis_client.get(cache_key)
        if cached_response:
            logger.info(f"Cache hit: {cache_key}")
            response_data = json.loads(cached_response)

            process_time = time.time() - start_time

            return ServiceResponse(
                status_code=200,
                body=response_data,
                from_cache=True,
                service=service,
                path=path,
                method=method,
                process_time=process_time
            )

    try:
        response = await call_service(
            method,
            url,
            headers=headers,
            params=service_request.query_params,
            json_data=service_request.body
        )

        response_data = response.json()

        if method == "GET" and response.status_code == 200:
            cache_key = get_enhanced_cache_key(
                service,
                path,
                method,
                service_request.query_params,
                headers
            )

            redis_client.set(
                cache_key,
                json.dumps(response_data),
                ttl=settings.CACHE_TTL
            )

        process_time = time.time() - start_time

        return ServiceResponse(
            status_code=response.status_code,
            headers=dict(response.headers),
            body=response_data,
            from_cache=from_cache,
            service=service,
            path=path,
            method=method,
            process_time=process_time
        )

    except httpx.TimeoutException as e:
        logger.error(f"Timeout error calling {url}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail=f"Service timeout: {str(e)}"
        )

    except httpx.HTTPError as e:
        logger.error(f"HTTP error calling {url}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Service communication error: {str(e)}"
        )

    except Exception as e:
        logger.exception(f"Error calling {url}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal error: {str(e)}"
        )