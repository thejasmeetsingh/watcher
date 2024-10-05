import os

import jwt
from fastapi import Request, HTTPException, status

from cache import get_cache_client


def get_jwt_payload(token: str) -> dict[str, str] | None:
    try:
        secret_key = os.getenv("SECRET_KEY")

        if not secret_key:
            secret_key = "random-secret-123"

        return jwt.decode(jwt=token, key=secret_key,
                          algorithms=["HS256"])
    except (jwt.ExpiredSignatureError, jwt.DecodeError) as _:
        return None


async def is_user_exists_in_cache(user_id: str) -> bool | None:
    """
    Check if user data exists in the centralized cache or not.
    """

    cache = await get_cache_client()
    user = await cache.get(user_id)

    # If the return value by cache is dict,
    # That means user exists in cache because that's how we were,
    # Saving the user details in the user service.
    return isinstance(user, dict)


async def get_user_id(request: Request) -> str:
    """
    Validate the request by checking the "Authorization" in the headers,
    And weather or not it contains a valid JWT token.

    Also checks the JWT payload after decoding it, Which should give us
    the current user ID. And checks weather or not the user exist in the,
    centralized cache.
    """

    authorization: str = request.headers.get("authorization")

    if not authorization or "Bearer" not in authorization:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Authentication Required")

    _, access_token = authorization.split()
    payload: dict[str, str] = get_jwt_payload(access_token)

    if not payload:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Invalid token passed")

    user_id: str | None = payload.get("data")

    if not user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Token is invalid or expired")

    is_user_exists = await is_user_exists_in_cache(user_id)

    if not is_user_exists:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Token is invalid or expired")

    return user_id
