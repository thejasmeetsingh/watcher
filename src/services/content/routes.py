from typing import Any, Annotated

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from client import CustomAsyncClient, get_client
from cache import CustomAsyncRedisClient, get_db_client

router = APIRouter()


@router.get("/recommended/")
async def get_recommended_movies_by_genres(
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    db: Annotated[CustomAsyncRedisClient, Depends(get_db_client)]
) -> JSONResponse:
    """
    Get recommended movies based on the genres that the,
    Current user has set in his/her profile.
    """

    async with client:
        try:
            # This is just for testing, It'll be replaced by UserID later on.
            key = 1

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
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    movie_id: int
) -> JSONResponse:
    """
    Get related-recommended movies based on the given movie ID. 
    """

    async with client:
        try:
            response = await client.get(endpoint=f"/movie/{movie_id}/recommendations")
            return JSONResponse(status_code=status.HTTP_200_OK, content=response.json())

        except Exception as _:
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={
                "message": "Internal server error"
            })


@router.get("/detail/{movie_id}/")
async def get_movie_details(
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    movie_id: int
) -> JSONResponse:
    """
    Get details of a movie
    """

    async with client:
        try:
            response = await client.get(endpoint=f"/movie/{movie_id}")
            return JSONResponse(status_code=status.HTTP_200_OK, content=response.json())

        except Exception as _:
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={
                "message": "Internal server error"
            })


@router.get("/videos/{movie_id}/")
async def get_movie_videos(
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    movie_id: int
) -> JSONResponse:
    """
    Get videos related to a movie.
    """

    async with client:
        try:
            response = await client.get(endpoint=f"/movie/{movie_id}/videos")
            return JSONResponse(status_code=status.HTTP_200_OK, content=response.json())

        except Exception as _:
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={
                "message": "Internal server error"
            })


@router.get("/search/")
async def search_movies(
    client: Annotated[CustomAsyncClient, Depends(get_client)],
    query: str
) -> JSONResponse:
    """
    Search movies based on the given query.
    Query can be genre, keyword, movie title etc.
    """

    async with client:
        try:
            response = await client.get(endpoint="/search/movie", params={"query": query})
            return JSONResponse(status_code=status.HTTP_200_OK, content=response.json())

        except Exception as _:
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={
                "message": "Internal server error"
            })
