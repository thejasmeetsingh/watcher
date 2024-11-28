from httpx import AsyncClient

import env


class CustomAsyncClient(AsyncClient):
    """
    Custom async client which will store
    basic properties like: BaseURL, headers
    which will be used in all API call
    to the MovieDB service.
    """

    def __init__(self, url: str, token: str):
        self.token = token
        self.url = url
        self.headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": f"Bearer {token}"
        }

        super().__init__(headers=self.headers)

    def get_absolute_url(self, endpoint: str) -> str:
        return self.url + endpoint

    async def get(self, endpoint: str, params: dict[str, str] | None = None):
        url = self.get_absolute_url(endpoint)
        return await super().get(url=url, params=params)


async def get_client():
    """
    Get custom API client instance
    """

    base_url = env.MOVIE_DB_BASE_URL
    token = env.MOVIE_DB_ACCESS_TOKEN

    if not base_url or not token:
        raise KeyError("MovieDB credentials are not configured in env")

    try:
        client = CustomAsyncClient(base_url, token)
        yield client
    except Exception:
        await client.aclose()
        raise
