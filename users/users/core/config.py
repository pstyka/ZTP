from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    APP_NAME: str = "Users Service"

@lru_cache()
def get_settings():
    return Settings()


settings = get_settings()
