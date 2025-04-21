from pydantic import BaseModel, EmailStr, Field
from uuid import UUID

class UserCreate(BaseModel):
    email: EmailStr
    password_hash: str
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)
    phone: str | None = Field(max_length=20)


class UserUpdate(UserCreate):
    pass


class UserRead(BaseModel):
    id: UUID
    email: EmailStr
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)
    phone: str | None = Field(max_length=20)