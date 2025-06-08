from fastapi import APIRouter, status, HTTPException, Body, Request
from users.database import Database
from users.schemas import UserCreate
from users.core.config import settings
from users.core.auth import create_access_token
from datetime import timedelta
from users.repository.user import user as user_repository


router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def create_user(user_in: UserCreate, db: Database):
    if user_repository.get_by_email(db, email=user_in.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system.",
        )

    user_repository.create(db, user_in)


@router.post("/token")
async def login_for_access_token(
    db: Database,
    email: str = Body(...),
    password: str = Body(...)
):
    user = user_repository.authenticate_user_by_email(db, email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role.value,
    }
    token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data=token_data,
        expires_delta=token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", status_code=status.HTTP_200_OK)
async def read_users_me(
    request: Request,
    db: Database,
):
    id = request.headers.get("X-User-ID")
    user = user_repository.get_by_id(db, id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user

@router.get("/{user_id}", status_code=status.HTTP_200_OK)
async def read_users_me(
    user_id: str,
    _: Request,
    db: Database,
):
    user = user_repository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return user
