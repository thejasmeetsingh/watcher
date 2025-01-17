import json
from typing import Any

import redis.asyncio as redis


class CustomAsyncRedisClient:
    """
    A custom async redis client to support a default expiry,
    And automatically converting I/O data from redis using json library,
    Which is not provided by the main redis library.
    """

    def __init__(self, host: str, port: int, db: int = 0, expiry: int | None = None) -> None:
        self.host = host
        self.port = port
        self.db = db
        self.expiry = expiry

        self.client = None

    async def connect(self):
        """
        Create a async redis instance and add it as an attribute in client
        """

        self.client = await redis.Redis(
            host=self.host,
            port=self.port,
            db=self.db,
            decode_responses=True
        )

    async def close(self):
        """
        Close the redis connection and set None in client attribute
        """

        await self.client.close()
        self.client = None

    async def get(self, key: str | int) -> Any:
        """
        Retrieve data for a given key
        """

        value: dict | None = await self.client.get(key)

        if value:
            value = json.loads(value)

        return value

    async def set(self, key: str | int, value: dict, expiry: int | None = 1800) -> None:
        """
        Set data for a given key
        """

        if expiry == 0:
            expiry = None
        elif expiry is None:
            expiry = self.expiry

        value = json.dumps(value)
        await self.client.set(key, value, ex=expiry)

    async def delete(self, key: str | int) -> Any:
        """
        Delete data for a given key
        """

        return await self.client.delete(key)
