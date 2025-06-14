import uvicorn
from users.core.config import settings
from fastapi import FastAPI, status
from users.routers.router import router as user_router
from users.routers.messages import router as message_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title=settings.APP_NAME,
    description="API Gateway",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

app.include_router(user_router)
app.include_router(message_router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True, log_config=None)
