from fastapi import APIRouter, Depends, Body, Request, status, HTTPException

from fastapi.security import OAuth2PasswordRequestForm
from gateway.proxy.services import proxy_request, ServiceRequest


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(
    request: Request,
    user_data: dict = Body(...)
):
    service_request = ServiceRequest(
        service="users",
        path="/users/register",
        method="POST",
        body=user_data
    )

    response = await proxy_request(request, service_request)
    return response.body


@router.post("/token", tags=["auth"])
async def login_for_access_token(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends()
):
    service_request = ServiceRequest(
        service="users",
        path="/users/token",
        method="POST",
        body= {
            "email": form_data.username,
            "password": form_data.password
        }
    )

    try:
        response = await proxy_request(request, service_request)
        return response.body
    except HTTPException as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=e.detail
        )