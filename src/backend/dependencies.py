"""
Centralize place to put functions which will serve as dependency in all API routes.
"""

from fastapi import Request, HTTPException, status

import env
import strings
from database import SessionLocal
from cache import CustomAsyncRedisClient
from user.models import User
from user.queries import get_user_by_id
from user.utils import get_jwt_payload


async def get_async_db_session():
    """
    Yield async db session instance
    """

    session = SessionLocal()
    try:
        yield session
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close()


async def get_user(request: Request) -> User | None:
    """
    Retrieve user object from auth token.
    """

    is_error = True
    authorization: str = request.headers.get("authorization")

    # Verify auth token format
    if authorization and "Bearer" in authorization:
        _, access_token = authorization.split()
        payload: dict[str, str] = get_jwt_payload(access_token)

        if payload:
            # Retrieve userID from the token payload
            user_id: str | None = payload.get("user_id")

            if user_id:
                # Fetch user object from DB using the ID.
                session = await get_async_db_session().asend(None)
                user = await get_user_by_id(session, user_id)

                if user:
                    is_error = False

    if is_error:
        # If content related APIs is being called except the content "favorite" API
        # Then don't raise the auth error since content APIs are accessible for
        # non-authenticated user as well
        path = request.url.components.path
        if "content" in path and "favorite" not in path:
            return None

        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=strings.INVALID_AUTH_TOKEN)

    return user


async def get_cache_client():
    """
    Get async redis cache client
    """

    host = env.REDIS_HOST
    port = env.REDIS_PORT

    if not host or not port:
        raise KeyError("Cache credentials are not configured in env")

    try:
        cache = CustomAsyncRedisClient(host=host, port=int(port))
        await cache.connect()
        yield cache
    except Exception:
        await cache.close()
        raise
