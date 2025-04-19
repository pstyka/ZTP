# app/auth/jwt.py w API Gateway
"""
JWT authentication utilities for API Gateway.
"""
import logging
from datetime import datetime, timedelta

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from gateway.core.config import settings

logger = logging.getLogger("gateway.auth.jwt")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


class TokenData:
    def __init__(self, username: str | None = None, roles: list[str] | None = None):
        self.username = username
        self.roles = roles or []


async def verify_token(token: str = Depends(oauth2_scheme)) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")

        if username is None:
            logger.warning("Token missing username")
            raise credentials_exception

        roles = payload.get("roles", [])
        return TokenData(username=username, roles=roles)
    except JWTError as e:
        logger.warning(f"JWT error: {str(e)}")
        raise credentials_exception


def has_role(roles: list[str]):
    async def role_checker(token_data: TokenData = Depends(verify_token)) -> TokenData:
        for role in roles:
            if role in token_data.roles:
                return token_data

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

    return role_checker