"""
Contains user schemas which will be in related APIs and ORM queries as input.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, UUID4, EmailStr, PositiveInt


class User(BaseModel):
    id: UUID4
    email: EmailStr
    created_at: datetime
    modified_at: datetime
    name: str
    age: PositiveInt
    genres: list[str]

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr = Field(max_length=50)
    password: str = Field(min_length=8)


class SignupRequest(LoginRequest):
    name: str = Field(max_length=50)
    age: PositiveInt = Field(gt=15)


class PasswordUpdateRequest(BaseModel):
    old_password: str = Field(min_length=8)
    new_password: str = Field(min_length=8)


class ProfileUpdateRequest(BaseModel):
    email: Optional[EmailStr] = Field(max_length=50, default=None)
    name: Optional[str] = Field(max_length=50, default=None)
    age: Optional[PositiveInt] = Field(ge=15, default=None)
    genres: Optional[list[str]] = None
