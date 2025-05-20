import gateway.core.logging_setup
import logging
import datetime
import uvicorn
from gateway.core.config import settings
from fastapi import FastAPI
from gateway.utils.redis import redis_client
import requests
from gateway.middleware.request_id import RequestIDMiddleware
from gateway.proxy.router import router as proxy_router
from gateway.auth.router import router as auth_router
from fastapi.middleware.cors import CORSMiddleware


logger = logging.getLogger("gateway.main")

app = FastAPI(
    title=settings.APP_NAME,
    description="API Gateway",
    docs_url="/docs",
    redoc_url="/redoc",
)


app.add_middleware(RequestIDMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["health"])
async def health_check():
    service_health = {}

    for service, url in settings.SERVICES.items():
        try:
            response = requests.get(f"{url}/health")
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


app.include_router(proxy_router, prefix=settings.API_PREFIX)
app.include_router(auth_router, prefix=settings.API_PREFIX)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, log_config=None)
