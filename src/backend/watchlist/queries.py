"""
ORM queries which will be used in WatchList APIs
"""

import uuid

from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_pagination import LimitOffsetParams
from fastapi_pagination.ext.sqlalchemy import paginate

from user.models import User
from watchlist.models import WatchList
from watchlist.schemas import WatchListAddItemRequest, WatchListUpdateItemRequest


async def get_user_watchlist(session: AsyncSession, user: User, params: LimitOffsetParams):
    query = select(WatchList).where(WatchList.user_id == user.id).order_by(
        WatchList.created_at.desc())

    results = await paginate(session, query, params)
    return results


async def add_watchlist_item(session: AsyncSession, user: User, request: WatchListAddItemRequest) -> WatchList:
    item = WatchList(
        id=uuid.uuid4(),
        user_id=user.id,
        movie_id=request.movie_id,
        is_complete=False
    )

    session.add(item)
    await session.commit()

    return item


async def get_watchlist_item(session: AsyncSession, watchlist_item_id: uuid.UUID) -> WatchList:
    item = await session.get(WatchList, watchlist_item_id)
    return item


async def is_watchlist_item_exists(session: AsyncSession, user: User, movie_id: int) -> bool:
    query = select(WatchList).where(WatchList.user_id ==
                                    user.id, WatchList.movie_id == movie_id)

    result = await session.execute(query)
    return result.fetchone() is not None


async def update_watchlist_item(session: AsyncSession, watchlist_item_id: uuid.UUID,
                                request: WatchListUpdateItemRequest) -> None:
    query = update(WatchList).where(WatchList.id == watchlist_item_id).values(
        request.model_dump(exclude_none=True))

    await session.execute(query)
    await session.commit()


async def delete_watchlist_item(session: AsyncSession, watchlist_item_id: uuid.UUID) -> None:
    query = delete(WatchList).where(WatchList.id == watchlist_item_id)

    await session.execute(query)
    await session.commit()
