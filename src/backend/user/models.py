import uuid
import re
from datetime import datetime

import sqlalchemy as sa
from sqlalchemy.orm import Mapped, mapped_column, validates
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.types import String
from database import Base


class User(Base):
    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, index=True)
    created_at: Mapped[datetime] = mapped_column(nullable=False,
                                                 server_default=sa.func.now())
    modified_at: Mapped[datetime] = mapped_column(nullable=False, server_default=sa.func.now(),
                                                  server_onupdate=sa.func.now())

    email: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    age: Mapped[int] = mapped_column(nullable=False)
    genres: Mapped[list[str]] = mapped_column(ARRAY(String),
                                              nullable=False, default=list)

    # Since PostgreSQL already have a table with name "user".
    # So we'll use a different table name.
    __tablename__ = "custom_user"

    __table_args__ = (
        sa.CheckConstraint(
            "email ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'",
            name='check_email_format'
        ),
        sa.CheckConstraint("age >= 15", name='check_age_minimum'),
    )

    def __str__(self) -> str:
        return self.name

    @validates("email")
    def validate_email(self, _, value):
        """
        RegEx for email validation
        """

        if not re.match(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", value):
            raise ValueError("Invalid email address")
        return value

    @validates("age")
    def validate_age(self, _, value):
        """
        Minimum age validator
        """

        if value < 15:
            raise ValueError("Age must be at least 15")
        return value
