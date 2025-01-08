from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import exc

import strings
from dependencies import get_async_db_session

from user.models import User
from user.queries import create_user, get_user_by_email
from user.schemas import User as UserSchema, SignupRequest, LoginRequest
from user.utils import generate_auth_tokens, validate_password, check_password

router = APIRouter()


def parse_user_obj_to_dict(obj: User) -> dict[str, Any]:
    return UserSchema.model_validate(obj).model_dump(mode="json")


@router.post("/register/")
async def register(
    request: SignupRequest,
    session: Annotated[AsyncSession, Depends(get_async_db_session)]
) -> JSONResponse:
    try:
        # Validate password
        password_err = validate_password(
            request.password,
            request.email,
            request.name,
        )

        if password_err:
            raise HTTPException(detail=password_err,
                                status_code=status.HTTP_400_BAD_REQUEST)

        # Check if a user already exists with the given email
        is_user_exists = await get_user_by_email(session, request.email)

        if is_user_exists:
            raise HTTPException(detail=strings.EMAIL_ALREADY_EXISTS,
                                status_code=status.HTTP_400_BAD_REQUEST)

        user = await create_user(session, request)
        token = generate_auth_tokens(str(user.id))

        return JSONResponse({
            "message": strings.ACCOUNT_CREATED_SUCCESS,
            "data": parse_user_obj_to_dict(user),
            "token": token
        }, status_code=status.HTTP_201_CREATED)

    except (
        exc.IntegrityError,
        ValueError
    ) as e:
        raise HTTPException(detail=str(
            e), status_code=status.HTTP_400_BAD_REQUEST) from e

    except exc.SQLAlchemyError as e:
        raise HTTPException(detail=str(
            e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR) from e


@router.post("/login/")
async def login(
    request: LoginRequest,
    session: Annotated[AsyncSession, Depends(get_async_db_session)]
) -> JSONResponse:
    try:
        # Check if a user exists with the given email
        user = await get_user_by_email(session, request.email)

        if not user:
            raise HTTPException(detail=strings.USER_DOES_NOT_EXISTS,
                                status_code=status.HTTP_403_FORBIDDEN)

        # Check user password
        if not check_password(request.password, user.password):
            raise HTTPException(detail=strings.INVALID_PASSWORD,
                                status_code=status.HTTP_403_FORBIDDEN)

        token = generate_auth_tokens(str(user.id))

        return JSONResponse({
            "message": strings.LOGIN_SUCCESS,
            "data": parse_user_obj_to_dict(user),
            "token": token
        }, status_code=status.HTTP_200_OK)

    except (
        exc.IntegrityError,
        ValueError
    ) as e:
        raise HTTPException(detail=str(
            e), status_code=status.HTTP_400_BAD_REQUEST) from e

    except exc.SQLAlchemyError as e:
        raise HTTPException(detail=str(
            e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR) from e
