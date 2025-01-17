import sys
import time
import logging
import uuid
from datetime import datetime, UTC
from typing import Callable

from fastapi import Request, Response


def get_logger() -> logging.Logger:
    """
    Configure logger
    """

    _logger = logging.getLogger(__name__)
    _logger.setLevel(logging.DEBUG)

    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(formatter)

    _logger.addHandler(console_handler)
    _logger.propagate = True

    return _logger


logger = get_logger()


class LoggingMiddleware:
    """
    Logging Middleware to log all details related to a request & response or
    any error that gets raised.
    """

    def __init__(self):
        self.request_id = str(uuid.uuid4())

    async def __call__(self, request: Request, call_next: Callable) -> Response:
        # Start timing the request
        start_time = time.perf_counter()

        # Generate unique request ID
        request_id = self.request_id

        # Log request details
        await self._log_request(request, request_id)

        # Process the request through the application
        try:
            response = await call_next(request)

            # Log response details
            await self._log_response(response, request, start_time, request_id)

            return response

        except Exception as e:
            # Log any errors
            logger.error(f"Request {request_id} failed with error: {str(e)}")
            raise e

    async def _log_request(self, request: Request, request_id: str):
        # Get client IP, handling proxy forwarding
        client_ip = request.client.host
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0]

        # Get request body if available
        body = None
        if request.method in ["POST", "PUT", "PATCH"]:
            try:
                body = await request.body()
                body = body.decode()
            except Exception as _:
                body = "Could not decode body"

        request_data = {
            "request_id": request_id,
            "timestamp": datetime.now(UTC).isoformat(),
            "client_ip": client_ip,
            "method": request.method,
            "url": str(request.url),
            "path_params": request.path_params,
            "query_params": request.query_params.__dict__,
            "headers": request.headers.__dict__,
            "cookies": request.cookies,
            "body": body,
        }

        logger.info({
            "message": f"Incoming request {request_id}",
            "request": request_data
        })

    async def _log_response(self, response: Response, _: Request,
                            start_time: float, request_id: str):

        process_time = time.perf_counter() - start_time

        response_data = {
            "request_id": request_id,
            "timestamp": datetime.now(UTC).isoformat(),
            "status_code": response.status_code,
            "process_time_ms": round(process_time, 2),
            "headers": response.headers.__dict__,
        }

        logger.info({
            "message": f"Response for request {request_id}",
            "response": response_data
        })
