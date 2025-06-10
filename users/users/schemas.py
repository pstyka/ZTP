from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, ConfigDict
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


class MessageCreate(BaseModel):
    receiver_id: UUID
    content: str


class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    sender_id: UUID
    receiver_id: UUID
    sender_name: str
    receiver_name: str
    content: str
    created_at: datetime
