import logging
from typing import Callable

from fastapi import FastAPI, Request, Response
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import settings

logger = logging.getLogger("api_gateway.middleware.rate_limit")


def get_key_from_ip_or_token(request: Request) -> str:
    if hasattr(request.state, "user") and hasattr(request.state.user, "username"):
        return f"user:{request.state.user.username}"

    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        return f"token:{token}"

    return f"ip:{get_remote_address(request)}"


def configure_rate_limiter(app: FastAPI) -> Limiter:
    limiter = Limiter(
        key_func=get_key_from_ip_or_token,
        default_limits=[settings.RATE_LIMIT_DEFAULT]
    )

    app.state.limiter = limiter

    @app.middleware("http")
    async def rate_limit_middleware(request: Request, call_next: Callable) -> Response:
        # Skip rate limiting for health check
        if request.url.path == "/health":
            return await call_next(request)

        limiter = app.state.limiter

        key = limiter.key_func(request)

        limiter.check_request(request)

        response = await call_next(request)

        if hasattr(request.state, "request_id"):
            logger.debug(
                f"Rate limit for {key}: "
                f"{request.state.request_id} {request.method} {request.url.path}"
            )

        return response

    return limiter