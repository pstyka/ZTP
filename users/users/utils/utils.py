from fastapi import HTTPException, Header
from uuid import UUID

def get_current_user_id(x_user_id: str = Header(..., alias="X-User-ID")) -> UUID:
    try:
        return UUID(x_user_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

def get_user_roles(x_user_roles: str = Header(..., alias="X-User-Roles")) -> str:
    return x_user_roles