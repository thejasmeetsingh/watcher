import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import exc
from fastapi_pagination import LimitOffsetPage, LimitOffsetParams

from dependencies import get_async_db_session, get_user
from user.models import User
from watchlist.models import WatchList
from watchlist.queries import (get_user_watchlist, get_watchlist_item, add_watchlist_item,
                               update_watchlist_item, delete_watchlist_item)
from watchlist.schemas import WatchList as WatchListSchema, WatchListAddItemRequest, WatchListUpdateItemRequest

import strings

router = APIRouter()


def parse_watchlist_obj_to_dict(obj: WatchList) -> dict[str, Any]:
    return WatchListSchema.model_validate(obj).model_dump(mode="json")


@router.get("/watchlist/")
async def get_watchlist(session: Annotated[AsyncSession, Depends(get_async_db_session)],
                        user: Annotated[User, Depends(get_user)],
                        params: Annotated[LimitOffsetParams, Depends()]) -> LimitOffsetPage[WatchList]:
    try:
        result = await get_user_watchlist(session, user, params)
        items = list(map(parse_watchlist_obj_to_dict, result.items))

        return JSONResponse({
            "total": result.total,
            "offset": result.offset,
            "limit": result.limit,
            "items": items
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


@router.post("/add-watchlist-item/")
async def add_item_in_watchlist(session: Annotated[AsyncSession, Depends(get_async_db_session)],
                                user: Annotated[User, Depends(get_user)],
                                request: WatchListAddItemRequest):
    try:
        item = await add_watchlist_item(session, user,
                                        request)

        return JSONResponse({
            "message": strings.WATCHLIST_ITEM_ADDED_SUCCESSFULLY,
            "data": parse_watchlist_obj_to_dict(item)
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


@router.put("/update-watchlist-item/{watchlist_id}/")
async def update_item_in_watchlist(session: Annotated[AsyncSession, Depends(get_async_db_session)],
                                   user: Annotated[User, Depends(get_user)],
                                   request: WatchListUpdateItemRequest,
                                   watchlist_id: uuid.UUID):
    try:
        item = await get_watchlist_item(session, watchlist_id)
        if not item:
            raise HTTPException(detail=strings.WATCHLIST_ITEM_DOES_NOT_EXISTS,
                                status_code=status.HTTP_400_BAD_REQUEST)

        if item.user_id != user.id:
            raise HTTPException(detail=strings.WATCHLIST_ITEM_FORBIDDEN_ERROR,
                                status_code=status.HTTP_403_FORBIDDEN)

        await update_watchlist_item(session, watchlist_id,
                                    request)

        await session.refresh(item)

        return JSONResponse({
            "message": strings.WATCHLIST_ITEM_UPDATED_SUCCESSFULLY,
            "data": parse_watchlist_obj_to_dict(item)
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


@router.delete("/remove-watchlist-item/{watchlist_id}/")
async def remove_watchlist_item(session: Annotated[AsyncSession, Depends(get_async_db_session)],
                                user: Annotated[User, Depends(get_user)],
                                watchlist_id: uuid.UUID):
    try:
        item = await get_watchlist_item(session, watchlist_id)
        if not item:
            raise HTTPException(detail=strings.WATCHLIST_ITEM_DOES_NOT_EXISTS,
                                status_code=status.HTTP_400_BAD_REQUEST)

        if item.user_id != user.id:
            raise HTTPException(detail=strings.WATCHLIST_ITEM_FORBIDDEN_ERROR,
                                status_code=status.HTTP_403_FORBIDDEN)

        await delete_watchlist_item(session, watchlist_id)

        return JSONResponse({"message": strings.WATCHLIST_ITEM_DELETED_SUCCESSFULLY},
                            status_code=status.HTTP_200_OK)
    except (
        exc.IntegrityError,
        ValueError
    ) as e:
        raise HTTPException(detail=str(
            e), status_code=status.HTTP_400_BAD_REQUEST) from e

    except exc.SQLAlchemyError as e:
        raise HTTPException(detail=str(
            e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR) from e
