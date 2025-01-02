import uuid
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import exc
from fastapi_pagination import Params

from dependencies import get_async_db_session, get_user, get_cache_client
from cache import CustomAsyncRedisClient
from user.models import User
from watchlist.models import WatchList
from watchlist.queries import (get_user_watchlist, get_watchlist_item, add_watchlist_item,
                               update_watchlist_item, delete_watchlist_item)
from watchlist.schemas import WatchList as WatchListSchema, WatchListAddItemRequest, WatchListUpdateItemRequest
from content.client import CustomAsyncClient, get_client

import strings

router = APIRouter()


def parse_watchlist_obj_to_dict(obj: WatchList) -> dict[str, Any]:
    return WatchListSchema.model_validate(obj).model_dump(mode="json")


@router.get("/")
async def get_watchlist(
        session: Annotated[AsyncSession, Depends(get_async_db_session)],
        user: Annotated[User, Depends(get_user)],
        cache: Annotated[CustomAsyncRedisClient, Depends(get_cache_client)],
        page: int = 1,
        size: int = 20,
        is_complete: bool | None = None
) -> JSONResponse:
    try:
        params = Params(page=page, size=size)
        page = await get_user_watchlist(session, user, params, is_complete)
        items = []

        for item in page.items:
            data = parse_watchlist_obj_to_dict(item)

            # Fetch movie details from cache
            key = f"{data['movie_id']}-watchlist_movie_detail"
            movie_details = await cache.get(key)

            if movie_details:
                movie_details.update({"watchlist": data})

            items.append(movie_details)

        return JSONResponse({
            "page": page.page if items else 0,
            "total_pages": page.pages if items else 0,
            "results": items
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


@router.post("/add-item/")
async def add_item_in_watchlist(
        session: Annotated[AsyncSession, Depends(get_async_db_session)],
        user: Annotated[User, Depends(get_user)],
        client: Annotated[CustomAsyncClient, Depends(get_client)],
        cache: Annotated[CustomAsyncRedisClient, Depends(get_cache_client)],
        request: WatchListAddItemRequest
) -> JSONResponse:
    try:
        item = await add_watchlist_item(session, user,
                                        request)

        # Fetch top level movie details from MovieDB API And save it into cache,
        # So that we can retrieve that when we return the watchlist
        key = f"{request.movie_id}-watchlist_movie_detail"
        movie_details = await cache.get(key)

        if not movie_details:
            response = await client.get(endpoint=f"/movie/{request.movie_id}")
            data = response.json()
            data["genre_ids"] = list(map(
                lambda genre: genre["id"],
                data["genres"]
            ))

            await cache.set(key, data)

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


@router.put("/update-item/{watchlist_id}/")
async def update_item_in_watchlist(
    session: Annotated[AsyncSession, Depends(get_async_db_session)],
    user: Annotated[User, Depends(get_user)],
    request: WatchListUpdateItemRequest,
    watchlist_id: uuid.UUID
) -> JSONResponse:
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


@router.delete("/remove-item/{watchlist_id}/")
async def remove_watchlist_item(
    session: Annotated[AsyncSession, Depends(get_async_db_session)],
    user: Annotated[User, Depends(get_user)],
    watchlist_id: uuid.UUID
) -> JSONResponse:
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
