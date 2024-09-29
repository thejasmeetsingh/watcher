import os
from typing import Annotated

from fastapi import FastAPI, Depends, status
from fastapi.responses import JSONResponse

from client import CustomAsyncClient

app = FastAPI()
app.title = "Watcher"
app.description = "Content Service"


async def get_client():
    """
    Get custom API client instance
    """

    base_url = os.getenv("MOVIE_DB_BASE_URL")
    token = os.getenv("MOVIE_DB_ACCESS_TOKEN")

    if not base_url or not token:
        raise KeyError("MovieDB credentials are not configured in env")

    client = CustomAsyncClient(base_url, token)

    try:
        yield client
    except Exception as _:
        await client.aclose()


@app.get("/health-check/", status_code=status.HTTP_200_OK)
async def health_check():
    return {"message": "Content service is up & running"}


@app.get("/discover/")
async def discover(client: Annotated[CustomAsyncClient, Depends(get_client)]) -> JSONResponse:
    async with client:
        try:
            response = await client.get(endpoint="/discover/movie")
            return JSONResponse(status_code=status.HTTP_200_OK, content=response.json())

        except Exception as _:
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={
                "message": "Internal server error"
            })
