"""
Contains WatchList schemas which will be in related APIs and ORM queries as input.
"""

from datetime import datetime
from pydantic import BaseModel, UUID4, PositiveInt


class WatchList(BaseModel):
    id: UUID4
    created_at: datetime
    modified_at: datetime
    movie_id: PositiveInt
    is_complete: bool

    class Config:
        from_attributes = True


class WatchListAddItemRequest(BaseModel):
    movie_id: PositiveInt


class WatchListUpdateItemRequest(BaseModel):
    is_complete: bool
