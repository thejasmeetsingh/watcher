"""
Contains user schemas which will be used in related APIs and ORM queries as input.
"""

from datetime import datetime

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
