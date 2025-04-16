import logging
from typing import Any

import redis
from fastapi import Request

from gateway.core.config import settings


logger = logging.getLogger("gateway.utils.core")


class RedisClient:
    def __init__(self, url: str = settings.REDIS_URL):
        self.client = redis.Redis.from_url(url, decode_responses=True)
        logger.info(f"Redis client initialized with URL: {url}")

    def ping(self) -> bool:
        try:
            return self.client.ping()
        except redis.exceptions.RedisError as e:
            logger.error(f"Redis connection error: {str(e)}")
            return False

    def get(self, key: str) -> str | None:
        try:
            return self.client.get(key)
        except redis.exceptions.RedisError as e:
            logger.error(f"Redis get error for key {key}: {str(e)}")
            return None

    def set(self, key: str, value: str, ttl: int = settings.CACHE_TTL) -> bool:
        try:
            return self.client.setex(key, ttl, value)
        except redis.exceptions.RedisError as e:
            logger.error(f"Redis set error for key {key}: {str(e)}")
            return False

    def delete(self, key: str) -> bool:
        try:
            return bool(self.client.delete(key))
        except redis.exceptions.RedisError as e:
            logger.error(f"Redis delete error for key {key}: {str(e)}")
            return False

    def flush_db(self) -> bool:
        try:
            return self.client.flushdb()
        except redis.exceptions.RedisError as e:
            logger.error(f"Redis flushdb error: {str(e)}")
            return False

    def info(self) -> dict[str, Any]:
        try:
            return self.client.info()
        except redis.exceptions.RedisError as e:
            logger.error(f"Redis info error: {str(e)}")
            return {}


def get_cache_key(request: Request, prefix: str = "cache") -> str:
    path = request.url.path
    method = request.method

    params = ""
    if request.query_params:
        sorted_params = "&".join(f"{k}={v}" for k, v in sorted(request.query_params.items()))
        params = f"?{sorted_params}"

    return f"{prefix}:{method}:{path}{params}"


def get_service_cache_key(service: str, path: str, method: str, params: dict[str, str] = None) -> str:
    key_parts = [service, path, method]

    if params:
        sorted_params = "&".join(f"{k}={v}" for k, v in sorted(params.items()))
        key_parts.append(sorted_params)

    return ":".join(key_parts)


redis_client = RedisClient()