from typing import Annotated

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from client import CustomAsyncClient, get_client
from cache import CustomAsyncRedisClient, get_db_client
from api.middleware import get_user

router = APIRouter()


@router.get("/recommended/")
async def get_recommended_movies_by_genres(
    user: Annotated[dict[str, str], Depends(get_user)],
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    db: Annotated[CustomAsyncRedisClient, Depends(get_db_client)]
) -> JSONResponse:
    """
    Get recommended movies based on the genres that the,
    Current user has set in his/her profile.
    """

    async with client:
        try:
            key = user["id"]

            data: dict | None = await db.get(key)

            if not data:
                response = await client.get(endpoint="/discover/movie")
                data = response.json()

                # Save response in DB
                await db.set(key, data)

            return JSONResponse(status_code=status.HTTP_200_OK, content=data)

        except Exception as _:
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={
                "message": "Internal server error"
            })


@router.get("/recommended/{movie_id}/")
async def get_recommended_movies_by_movie_id(
    user: Annotated[dict[str, str], Depends(get_user)],
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    db: Annotated[CustomAsyncRedisClient, Depends(get_db_client)],
    movie_id: int
) -> JSONResponse:
    """
    Get related-recommended movies based on the given movie ID. 
    """

    async with client:
        try:
            key = f"{movie_id}-recommendation"

            data: dict | None = await db.get(key)

            if not data:
                response = await client.get(endpoint=f"/movie/{movie_id}/recommendations")
                data = response.json()

                # Save response in DB
                await db.set(key, data)

            # Fetch the favorite movie status for current user
            fav_key = f"{user['id']}-{movie_id}"
            is_favorite = await db.get(fav_key)

            # Append the local data into the response
            data.update({
                "todo_item_id": user.get(movie_id),
                "is_favorite": is_favorite
            })

            return JSONResponse(status_code=status.HTTP_200_OK, content=data)

        except Exception as _:
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={
                "message": "Internal server error"
            })


@router.get("/detail/{movie_id}/")
async def get_movie_details(
    _: Annotated[dict[str, str], Depends(get_user)],
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    db: Annotated[CustomAsyncRedisClient, Depends(get_db_client)],
    movie_id: int
) -> JSONResponse:
    """
    Get details of a movie
    """

    async with client:
        try:
            key = f"{movie_id}-detail"

            data: dict | None = await db.get(key)

            if not data:
                response = await client.get(endpoint=f"/movie/{movie_id}")
                data = response.json()

                # Save response in DB
                await db.set(key, data)

            return JSONResponse(status_code=status.HTTP_200_OK, content=data)

        except Exception as _:
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={
                "message": "Internal server error"
            })


@router.get("/videos/{movie_id}/")
async def get_movie_videos(
    _: Annotated[dict[str, str], Depends(get_user)],
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    db: Annotated[CustomAsyncRedisClient, Depends(get_db_client)],
    movie_id: int
) -> JSONResponse:
    """
    Get videos related to a movie.
    """

    async with client:
        try:
            key = f"{movie_id}-video"

            data: dict | None = await db.get(key)

            if not data:
                response = await client.get(endpoint=f"/movie/{movie_id}/videos")
                data = response.json()

                # Save response in DB
                await db.set(key, data)

            return JSONResponse(status_code=status.HTTP_200_OK, content=data)

        except Exception as _:
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={
                "message": "Internal server error"
            })


@router.get("/search/")
async def search_movies(
    user: Annotated[dict[str, str], Depends(get_user)],
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    db: Annotated[CustomAsyncRedisClient, Depends(get_db_client)],
    query: str
) -> JSONResponse:
    """
    Search movies based on the given query.
    Query can be genre, keyword, movie title etc.
    """

    async with client:
        try:
            key = f"{user['id']}-{query}-search"

            data: dict | None = await db.get(key)

            if not data:
                response = await client.get(endpoint="/search/movie", params={"query": query})
                data = response.json()

                # Save response in DB
                await db.set(key, data)

            return JSONResponse(status_code=status.HTTP_200_OK, content=data)

        except Exception as _:
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={
                "message": "Internal server error"
            })
