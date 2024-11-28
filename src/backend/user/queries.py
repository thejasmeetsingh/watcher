"""
ORM queries which will be used in user APIs
"""

import uuid

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from user.models import User
from user.schemas import SignupRequest, PasswordUpdateRequest, ProfileUpdateRequest
from user.utils import get_hashed_password


async def get_user_by_id(session: AsyncSession, user_id: uuid.UUID) -> User | None:
    user = await session.get(User, user_id)
    return user


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    result = await session.execute(select(User).where(User.email == email.lower()))
    user = result.fetchone()
    if user:
        # Since fetchone return result in a tuple,
        # Need to pick the first object from the tuple
        user = user[0]

    return user


async def create_user(session: AsyncSession, request: SignupRequest) -> User:
    hashed_password = get_hashed_password(request.password)

    user = User(
        id=uuid.uuid4(),
        email=request.email.lower(),
        password=hashed_password,
        name=request.name,
        age=request.age
    )

    session.add(user)
    await session.commit()

    return user


async def update_password(session: AsyncSession, user: User, request: PasswordUpdateRequest) -> None:
    hashed_password = get_hashed_password(request.new_password)
    query = update(User).where(User.id == user.id).values(
        password=hashed_password)

    await session.execute(query)
    await session.commit()


async def update_profile(session: AsyncSession, user: User, request: ProfileUpdateRequest) -> None:
    query = update(User).where(User.id == user.id).values(
        request.model_dump(exclude_none=True))

    await session.execute(query)
    await session.commit()
