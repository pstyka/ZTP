import logging

from fastapi import APIRouter, Depends, Request, HTTPException, status
from gateway.auth.jwt import verify_token, TokenData
from gateway.proxy.services import proxy_request, ServiceRequest

logger = logging.getLogger("api_gateway.proxy.chat_router")

router = APIRouter(prefix="/chat", tags=["chat"])


@router.api_route("/{path:path}", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
async def chat_proxy(path: str, request: Request, token_data: TokenData = Depends(verify_token)):
    method = request.method
    logger.info(f"Proxying {method} request to chat service: /{path}")

    body = None
    if method in ["POST", "PUT", "PATCH"]:
        try:
            body = await request.json()
        except Exception:
            body = None

    service_request = ServiceRequest(
        service="chat",
        path=f"/chat/{path}",
        method=method,
        headers={
            "X-User-ID": str(token_data.username),
            "X-User-Roles": token_data.role,
        },
        body=body
    )
    response = await proxy_request(request, service_request)
    return response.body