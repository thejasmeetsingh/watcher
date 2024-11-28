import jwt
import bcrypt
from datetime import datetime, timedelta, UTC

import env
import strings


def get_hashed_password(password: str) -> str:
    """
    Generate hashed password from raw password string
    """

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed_password.decode('utf-8')


def check_password(raw_password: str, hashed_password: str) -> bool:
    """
    Validate raw/input password with hashed password
    """

    return bcrypt.checkpw(
        raw_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )


def has_digits(password: str) -> bool:
    """
    Function for checking if password contains a digit or not
    """

    return any(char.isdigit() for char in password)


def has_special_character(password: str) -> bool:
    """
    Function for checking if password contains a special character or not
    """

    special_chars = "[!@#$%^&*()]"
    return any(char in special_chars for char in password)


def validate_password(password: str, email: str, name: str) -> str | None:
    """
    Perform basic password validation checks
    """

    if " " in password:
        error_message = strings.PASSWORD_CONTAINS_SPACES

    elif len(password) < 8:
        error_message = strings.PASSWORD_LENGTH_ERROR

    elif email in password or name in password:
        error_message = strings.PASSWORD_CONTAINS_NAME_EMAIL

    elif password.lower() == password:
        error_message = strings.PASSWORD_CONTAINS_LOWER_CHARS

    elif password.upper() == password:
        error_message = strings.PASSWORD_CONTAINS_UPPER_CHARS

    elif not has_digits(password):
        error_message = strings.PASSWORD_DIGITS_ERROR

    elif not has_special_character(password):
        error_message = strings.PASSWORD_SPECIAL_CHAR_ERROR

    else:
        error_message = None

    return error_message


def generate_auth_tokens(user_id: str) -> str:
    """
    Generate authentication tokens for a given user.
    """

    payload = {
        "user_id": user_id,
        "exp": datetime.now(UTC) + timedelta(minutes=int(env.AUTH_TOKEN_EXP))
    }

    token = jwt.encode(payload=payload, key=env.SECRET_KEY, algorithm="HS256")
    return token


def get_jwt_payload(token: str) -> dict | None:
    """
    Retrieve payload from a given JWT token string
    """

    try:
        payload = jwt.decode(jwt=token, key=env.SECRET_KEY,
                             algorithms=["HS256"])
        return payload
    except (jwt.ExpiredSignatureError, jwt.DecodeError) as _:
        return None
