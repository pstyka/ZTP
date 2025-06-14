from pydantic_settings import BaseSettings
from pydantic import RedisDsn, SecretStr
from functools import lru_cache


class Settings(BaseSettings):
    APP_NAME: str = "API Gateway"
    API_PREFIX: str = "/api/v1"

    # REDIS
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    CACHE_TTL: int = 3600  # 1 hour

    # JWT
    SECRET_KEY: str = "secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Circuit breaker
    CIRCUIT_BREAKER_FAILURE_THRESHOLD: int =  5
    CIRCUIT_BREAKER_RECOVERY_TIMEOUT: int = 30

    SERVICE_TIMEOUT: float = 10.0

    FRONTEND_SERVICE_URL: str = "localhost:4200"
    USER_SERVICE_URL: str = "http://users:8888"
    REST_API_SERVICE_URL: str = "http://restapi:8080"

    @property
    def SERVICES(self) -> dict[str, str]:
        return {
            "frontend": self.FRONTEND_SERVICE_URL,
            "users": self.USER_SERVICE_URL,
            "chat": self.USER_SERVICE_URL,
            "rest": self.REST_API_SERVICE_URL,
        }

    @property
    def REDIS_URL(self) -> RedisDsn:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"


@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
