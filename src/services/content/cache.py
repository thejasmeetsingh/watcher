import os
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

    async def set(self, key: str | int, value: dict, expiry: int | None = None) -> None:
        """
        Set data for a given key
        """

        if not expiry:
            expiry = self.expiry

        value = json.dumps(value)
        await self.client.set(key, value, ex=expiry)

    async def delete(self, key: str | int) -> Any:
        """
        Delete data for a given key
        """

        return await self.client.delete(key)


async def get_db_client():
    """
    Get main DB (redis) client.
    """

    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT")
    exp = os.getenv("DB_DATA_EXP")

    if not host or not port or not exp:
        raise KeyError("DB credentials are not configured in env")

    db = CustomAsyncRedisClient(host=host, port=int(port), expiry=int(exp))
    await db.connect()

    try:
        yield db
    except Exception as _:
        await db.close()


async def get_cache_client():
    """
    Get common redis cache client
    """

    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT")

    if not host or not port:
        raise KeyError("Cache credentials are not configured in env")

    cache = CustomAsyncRedisClient(host=host, port=int(port))
    await cache.connect()

    try:
        yield cache
    except Exception as _:
        await cache.close()
