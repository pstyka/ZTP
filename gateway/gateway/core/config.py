from pydantic_settings import BaseSettings
from pydantic import RedisDsn, SecretStr
from functools import lru_cache


class Settings(BaseSettings):
    APP_NAME: str = "API Gateway"

    # REDIS
    REDIS_HOST: str = "redis"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    CACHE_TTL: int = 3600  # 1 hour

    @property
    def REDIS_URL(self) -> RedisDsn:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{self.REDIS_DB}"

    FRONTEND_SERVICE_URL: str = "http://frontend-service:3000"
    REST_API_SERVICE_URL: str = "http://rest-api-service:8080"

    @property
    def SERVICES(self) -> dict[str, str]:
        return {
            "frontend": self.FRONTEND_SERVICE_URL,
            "rest_api": self.REST_API_SERVICE_URL,
        }



@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
