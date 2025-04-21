import logging

from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from dataclasses import dataclass
from gateway.core.config import settings

logger = logging.getLogger("gateway.auth.jwt")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


@dataclass
class TokenData:
    username: str
    role: str


async def verify_token(token: str = Depends(oauth2_scheme)) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")

        if not username:
            logger.warning("Token missing username")
            raise credentials_exception

        role = payload.get("role", "")
        return TokenData(username=username, role=role)
    except JWTError as e:
        logger.warning(f"JWT error: {str(e)}")
        raise credentials_exception

