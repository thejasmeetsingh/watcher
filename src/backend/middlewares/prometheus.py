import time
from typing import Callable

from fastapi import Request, Response
from prometheus_client import Counter, Histogram


class PrometheusMiddleware:
    """
    Prometheus Middleware for recording request related stats like:
    Total request count and request duration on prometheus.
    """

    def __init__(self):
        # Initialize the http_request_total and http_request_duration
        self.http_request_total = Counter(
            name="http_requests_total",
            documentation="Total number of HTTP requests.",
            labelnames=["method", "path"]
        )

        self.http_request_duration = Histogram(
            name="http_request_duration_seconds",
            documentation="HTTP request duration in seconds.",
            labelnames=["method", "path", "status"]
        )

    async def __call__(self, request: Request, call_next: Callable) -> Response:
        # Record total requests received
        self.http_request_total.labels(method=request.method,
                                       path=request.url.path).inc()

        # Start timing the request
        start_time = time.perf_counter()

        # Continue processing the request
        response: Response = await call_next(request)

        # Find how much time it took to process the request, In seconds.
        duration = time.perf_counter() - start_time

        # Record the request duration.
        self.http_request_duration.labels(
            method=request.method,
            path=request.url.path,
            status=response.status_code
        ).observe(duration)

        return response
