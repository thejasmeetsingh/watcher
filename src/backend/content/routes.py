import uuid
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


@router.get("/genres/")
async def get_genres(
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    cache: Annotated[CustomAsyncRedisClient, Depends(get_cache_client)]
) -> JSONResponse:
    """
    Get list of genres
    """

    async with client:
        try:
            key = "genres"

            data: dict | None = await cache.get(key)

            if not data:
                response = await client.get(endpoint="/genre/movie/list")
                data = response.json().get("genres", [])

                # Save response in cache
                await cache.set(key, data)

            return JSONResponse(data, status_code=status.HTTP_200_OK)

        except Exception as e:
            raise HTTPException(detail=str(
                e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR) from e


@router.get("/featured-movies/")
async def get_recommended_movies_by_genres(
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    cache: Annotated[CustomAsyncRedisClient, Depends(get_cache_client)]
) -> JSONResponse:
    """
    Get featured movies based, which is the combination of:
    now playing, popular, top rated and upcoming movies.
    """

    async with client:
        try:
            key = "featured_movies"

            data: dict | None = await cache.get(key)

            if not data:
                # Fetch movies which are currently playing in theaters
                response = await client.get(endpoint="/movie/now_playing")
                now_playing = response.json().get("results", [])

                now_playing.sort(key=lambda x: x["popularity"],
                                 reverse=True)

                # Fetch movies which are popular
                response = await client.get(endpoint="/movie/popular")
                popular = response.json().get("results", [])

                # Fetch top rated movies
                response = await client.get(endpoint="/movie/top_rated")
                top_rated = response.json().get("results", [])

                # Fetch upcoming movies
                response = await client.get(endpoint="/movie/upcoming")
                upcoming = response.json().get("results", [])

                data = {
                    "now_playing": now_playing[:5],
                    "popular": popular,
                    "top_rated": top_rated,
                    "upcoming": upcoming
                }

                # Save response in cache
                await cache.set(key, data)

            return JSONResponse(data, status_code=status.HTTP_200_OK)

        except Exception as e:
            raise HTTPException(detail=str(
                e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR) from e


@router.get("/genre/{genre_id}/")
async def get_movies_by_genre(
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    cache: Annotated[CustomAsyncRedisClient, Depends(get_cache_client)],
    genre_id: int,
    page: int = 1,
    user: Annotated[User | None, Depends(get_user)] = None
) -> JSONResponse:
    """
    Get movies by based on given genreID
    """

    async with client:
        try:
            key = f"{genre_id}-{page}-movies_by_genre"

            data: dict | None = await cache.get(key)

            if not data:
                # Include mature or R-rated movies if user is authenticated
                # And is at least 18 years old.
                include_adult = user and user.age >= 18

                response = await client.get(endpoint="/discover/movie",
                                            params={"with_genres": genre_id, "page": page, "include_adult": include_adult})
                data = response.json()

                # Save response in DB
                await cache.set(key, data)

            return JSONResponse(data, status_code=status.HTTP_200_OK)

        except Exception as e:
            raise HTTPException(detail=str(
                e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR) from e


@router.get("/detail/{movie_id}/")
async def get_movie_details(
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    session: Annotated[AsyncSession, Depends(get_async_db_session)],
    cache: Annotated[CustomAsyncRedisClient, Depends(get_cache_client)],
    movie_id: int,
    user: Annotated[User | None, Depends(get_user)] = None
) -> JSONResponse:
    """
    Get details of a movie
    """

    async with client:
        try:
            key = f"{movie_id}-detail"

            data: dict | None = await cache.get(key)

            is_added_in_watchlist = None
            is_favorite = False

            if user:
                # Fetch the favorite movie status for current user
                fav_key = f"{user.id}-{movie_id}"
                is_favorite = await cache.get(fav_key)

                # Check if current user has already added the movie
                # into his/her watchlist
                is_added_in_watchlist = await is_watchlist_item_exists(session, user, movie_id)

            if not data:
                response = await client.get(endpoint=f"/movie/{movie_id}",
                                            params={"append_to_response": "recommendations,videos,images"})
                data = response.json()

                # Save response in cache
                await cache.set(key, data)

            # Append the local data into the response
            data.update({
                "is_added_in_watchlist": str(is_added_in_watchlist)
                if isinstance(is_added_in_watchlist, uuid.UUID) else is_added_in_watchlist,
                "is_favorite": bool(is_favorite)
            })

            return JSONResponse(data, status_code=status.HTTP_200_OK)

        except Exception as e:
            raise HTTPException(detail=str(
                e), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR) from e


@router.get("/search/")
async def search_movies(
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    cache: Annotated[CustomAsyncRedisClient, Depends(get_cache_client)],
    query: str,
    page: int = 1,
    user: Annotated[User | None, Depends(get_user)] = None
) -> JSONResponse:
    """
    Search movies based on the given query.
    Query can be genre, keyword, movie title etc.
    """

    async with client:
        try:
            key = f"{query}-{page}-search"

            data: dict | None = await cache.get(key)

            if not data:
                # Include mature or R-rated movies if user is authenticated
                # And is at least 18 years old.
                include_adult = user and user.age >= 18

                response = await client.get(endpoint="/search/movie",
                                            params={"query": query, "page": page, "include_adult": include_adult})
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

        await cache.set(key, True)

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
