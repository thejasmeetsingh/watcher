from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

import strings
from cache import CustomAsyncRedisClient
from dependencies import get_user, get_cache_client, get_async_db_session
from content.client import CustomAsyncClient, get_client
from user.models import User
from watchlist.queries import is_watchlist_item_exists

router = APIRouter()


@router.get("/recommended/")
async def get_recommended_movies_by_genres(
    user: Annotated[User, Depends(get_user)],
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    cache: Annotated[CustomAsyncRedisClient, Depends(get_cache_client)]
) -> JSONResponse:
    """
    Get recommended movies based on the genres that the,
    Current user has set in his/her profile.
    """

    async with client:
        try:
            key = str(user.id)

            data: dict | None = await cache.get(key)

            if not data:
                response = await client.get(endpoint="/discover/movie")
                data = response.json()

                # Save response in cache
                await cache.set(key, data)

            return JSONResponse(data, status_code=status.HTTP_200_OK)

        except Exception as e:
            raise HTTPException(detail=str(
                e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR) from e


@router.get("/recommended/{movie_id}/")
async def get_recommended_movies_by_movie_id(
    _: Annotated[User, Depends(get_user)],
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    cache: Annotated[CustomAsyncRedisClient, Depends(get_cache_client)],
    movie_id: int
) -> JSONResponse:
    """
    Get related-recommended movies based on the given movie ID.
    """

    async with client:
        try:
            key = f"{movie_id}-recommendation"

            data: dict | None = await cache.get(key)

            if not data:
                response = await client.get(endpoint=f"/movie/{movie_id}/recommendations")
                data = response.json()

                # Save response in cache
                await cache.set(key, data)

            return JSONResponse(data, status_code=status.HTTP_200_OK)

        except Exception as e:
            raise HTTPException(detail=str(
                e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR) from e


@router.get("/detail/{movie_id}/")
async def get_movie_details(
    user: Annotated[User, Depends(get_user)],
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    session: Annotated[AsyncSession, Depends(get_async_db_session)],
    cache: Annotated[CustomAsyncRedisClient, Depends(get_cache_client)],
    movie_id: int
) -> JSONResponse:
    """
    Get details of a movie
    """

    async with client:
        try:
            key = f"{movie_id}-detail"

            data: dict | None = await cache.get(key)

            # Fetch the favorite movie status for current user
            fav_key = f"{user.id}-{movie_id}"
            is_favorite = await cache.get(fav_key)

            # Check if current user has already added the movie
            # into his/her watchlist
            is_added_in_watchlist = await is_watchlist_item_exists(session, user, movie_id)

            if not data:
                response = await client.get(endpoint=f"/movie/{movie_id}")
                data = response.json()

                # Save response in cache
                await cache.set(key, data)

            # Append the local data into the response
            data.update({
                "is_added_in_watchlist": is_added_in_watchlist,
                "is_favorite": bool(is_favorite)
            })

            return JSONResponse(data, status_code=status.HTTP_200_OK)

        except Exception as e:
            raise HTTPException(detail=str(
                e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR) from e


@router.get("/videos/{movie_id}/")
async def get_movie_videos(
    _: Annotated[User, Depends(get_user)],
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    cache: Annotated[CustomAsyncRedisClient, Depends(get_cache_client)],
    movie_id: int
) -> JSONResponse:
    """
    Get videos related to a movie.
    """

    async with client:
        try:
            key = f"{movie_id}-video"

            data: dict | None = await cache.get(key)

            if not data:
                response = await client.get(endpoint=f"/movie/{movie_id}/videos")
                data = response.json()

                # Save response in DB
                await cache.set(key, data)

            return JSONResponse(data, status_code=status.HTTP_200_OK)

        except Exception as e:
            raise HTTPException(detail=str(
                e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR) from e


@router.get("/search/")
async def search_movies(
    user: Annotated[User, Depends(get_user)],
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    cache: Annotated[CustomAsyncRedisClient, Depends(get_cache_client)],
    query: str
) -> JSONResponse:
    """
    Search movies based on the given query.
    Query can be genre, keyword, movie title etc.
    """

    async with client:
        try:
            key = f"{user.id}-{query}-search"

            data: dict | None = await cache.get(key)

            if not data:
                response = await client.get(endpoint="/search/movie", params={"query": query})
                data = response.json()

                # Save response in DB
                await cache.set(key, data)

            return JSONResponse(data, status_code=status.HTTP_200_OK)

        except Exception as e:
            raise HTTPException(detail=str(
                e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR) from e


@router.post("/favorite/{movie_id}/")
async def mark_movie_favorite(
    user: Annotated[User, Depends(get_user)],
    cache: Annotated[CustomAsyncRedisClient, Depends(get_cache_client)],
    movie_id: int
) -> JSONResponse:
    """
    Mark the given movie as favorite for the current user.
    """

    try:
        key = f"{user.id}-{movie_id}"

        await cache.set(key, True, 0)

        return JSONResponse({
            "message": strings.MOVIE_MARKED_FAVORITE_SUCCESSFULLY
        }, status_code=status.HTTP_201_CREATED)

    except Exception as e:
        raise HTTPException(detail=str(
            e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR) from e


@router.delete("/favorite/{movie_id}/")
async def remove_movie_favorite(
    user: Annotated[User, Depends(get_user)],
    cache: Annotated[CustomAsyncRedisClient, Depends(get_cache_client)],
    movie_id: int
) -> JSONResponse:
    """
    Remove the given movie as favorite for the current user.
    """

    try:
        key = f"{user.id}-{movie_id}"

        await cache.delete(key)

        return JSONResponse({
            "message": strings.MOVIE_REMOVED_AS_FAVORITE_SUCCESSFULLY
        }, status_code=status.HTTP_200_OK)

    except Exception as e:
        raise HTTPException(detail=str(
            e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR) from e
