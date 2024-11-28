import uuid
from datetime import datetime

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class WatchList(Base):
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, index=True)
    created_at: Mapped[datetime] = mapped_column(nullable=False,
                                                 server_default=sa.func.now())
    modified_at: Mapped[datetime] = mapped_column(nullable=False, server_default=sa.func.now(),
                                                  server_onupdate=sa.func.now())

    user_id: Mapped[uuid.UUID] = mapped_column(
        sa.ForeignKey("custom_user.id"), nullable=False)
    movie_id: Mapped[int] = mapped_column(nullable=False)
    is_complete: Mapped[bool] = mapped_column(nullable=False, default=False)

    __tablename__ = "watchlist"

    __table_args__ = (
        sa.UniqueConstraint("user_id", "movie_id", name="unique_user_movie"),
    )

    def __str__(self) -> str:
        return f"{self.user_id}-{self.movie_id}"
