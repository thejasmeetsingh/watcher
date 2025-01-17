#!/bin/sh
alembic upgrade head  # Apply DB migrations
fastapi run --proxy-headers --reload  # Run app server
