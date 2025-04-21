import logging

from fastapi import APIRouter, Depends, Request, HTTPException, status, Body
from gateway.auth.jwt import verify_token, has_role, TokenData
from gateway.proxy.services import proxy_request, ServiceRequest

logger = logging.getLogger("api_gateway.proxy.router")

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
async def get_current_user(request: Request, token_data: TokenData = Depends(verify_token)):
    service_request = ServiceRequest(
        service="users",
        path=f"/users/{token_data.username}",
        method="GET",
        headers={
            "X-User": str(token_data.username),
            "X-User-Roles": token_data.role
        }
    )
    response = await proxy_request(request, service_request)
    return response.body


# @router.get("/api/admin/users", tags=["admin"])
# async def get_all_users(request: Request, token_data: TokenData = Depends(has_role(["admin"]))):
#     service_request = ServiceRequest(
#         service="users",
#         path="/users",
#         method="GET",
#         headers={
#             "X-User": str(token_data.username),
#             "X-User-Roles": ",".join(token_data.roles)
#         }
#     )
#     response = await proxy_request(request, service_request)
#     return response.body


@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def users_proxy(path: str, request: Request, token_data: TokenData = Depends(verify_token)):
    method = request.method

    admin_paths = ["/", "/create"]
    if path in admin_paths and "admin" not in token_data.roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    body = None
    if method in ["POST", "PUT"]:
        body = await request.json()

    service_request = ServiceRequest(
        service="users",
        path=f"/users/{path}",
        method=method,
        headers={
            "X-User": str(token_data.username),
            "X-User-Roles": token_data.role
        },
        body=body
    )


    response = await proxy_request(request, service_request)
    return response.body