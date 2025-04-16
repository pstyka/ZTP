import gateway.core.logging_setup
import datetime
import uvicorn
from gateway.core.config import settings
from fastapi import FastAPI
from gateway.utils.redis import redis_client
import requests
from gateway.middleware.request_id import RequestIDMiddleware


app = FastAPI(
    title=settings.APP_NAME,
    description="API Gateway",
    docs_url="/docs",
    redoc_url="/redoc",
)


app.add_middleware(RequestIDMiddleware)


@app.get("/health", tags=["health"])
async def health_check():
    service_health = {}

    for service, url in settings.SERVICES.items():
        try:
            response = requests.get(url)
            service_health[service] = "up" if response.status_code == 200 else "down"
        except requests.RequestException:
            service_health[service] = "down"

    return {
        "status": "app",
        "timestamp": datetime.datetime.now(datetime.UTC).isoformat(),
        "dependencies": {
            "redis": "up" if redis_client.ping() else "down",
            "services": service_health
        }
    }


@app.get("/", tags=["root"])
async def get_root():
    return {
        "name": settings.APP_NAME,
        "docs": "/docs",
        "health": "/health",
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_config=None)
