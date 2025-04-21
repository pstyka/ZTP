import uvicorn
from users.core.config import settings
from fastapi import FastAPI, status
from users.router import router as user_router

app = FastAPI(
    title=settings.APP_NAME,
    description="API Gateway",
    docs_url="/docs",
    redoc_url="/redoc",
)


@app.get("/health", tags=["health"])
async def health_check():
    return status.HTTP_200_OK


@app.get("/", tags=["root"])
async def get_root():
    return {
        "name": settings.APP_NAME,
        "docs": "/docs",
        "health": "/health",
    }

app.include_router(user_router, prefix="/users", tags=["users"])


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True, log_config=None)
