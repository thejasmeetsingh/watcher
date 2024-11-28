"""
Centralize place to load env variables which will be used across the project.
"""

import os

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = os.getenv("REDIS_PORT")

AUTH_TOKEN_EXP = os.getenv("AUTH_TOKEN_EXP")
SECRET_KEY = os.getenv("SECRET_KEY")

MOVIE_DB_BASE_URL = os.getenv("MOVIE_DB_BASE_URL")
MOVIE_DB_ACCESS_TOKEN = os.getenv("MOVIE_DB_ACCESS_TOKEN")
