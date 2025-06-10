import logging

from fastapi import APIRouter, Depends, Request, HTTPException, status, Body
from gateway.auth.jwt import verify_token, TokenData
from gateway.proxy.services import proxy_request, ServiceRequest

logger = logging.getLogger("api_gateway.proxy.rest_router")

router = APIRouter(prefix="/rest", tags=["rest"])

@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def rest_proxy(path: str, request: Request):
    method = request.method

    body = None
    if method in ["POST", "PUT", "PATCH"]:
        body = await request.json()

    service_request = ServiceRequest(
        service="rest",
        path=f"/rest/{path}",
        method=method,
        # headers={
        #     "X-User-ID": str(token_data.username),
        #     "X-User-Roles": token_data.role
        # },
        body=body
    )


    response = await proxy_request(request, service_request)
    return response.body