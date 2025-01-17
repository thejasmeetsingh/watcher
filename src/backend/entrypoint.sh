#!/bin/sh
alembic upgrade head  # Apply DB migrations
fastapi run --proxy-headers  # Run app server
