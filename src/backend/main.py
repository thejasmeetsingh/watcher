import time

from fastapi import FastAPI, Request, Response, status
from fastapi_pagination import add_pagination
from prometheus_client import Counter, Histogram, make_asgi_app

from user.routes import router as u_router
from watchlist.routes import router as w_router
from content.routes import router as c_router


def get_app() -> FastAPI:
    _app = FastAPI()

    _app.title = "Watcher"
    _app.description = "Watcher Backend"
    _app.include_router(u_router, prefix="/api")
    _app.include_router(w_router, prefix="/api")
    _app.include_router(c_router, prefix="/api")

    # Add prometheus ASGI middleware to route /metrics requests
    metrics_app = make_asgi_app()
    _app.mount("/metrics/", metrics_app)

    return _app


app = get_app()
add_pagination(app)

# Initialize the http_request_total and http_request_duration
http_request_total = Counter(
    name="http_requests_total",
    documentation="Total number of HTTP requests.",
    labelnames=["method", "path"]
)

http_request_duration = Histogram(
    name="http_request_duration_seconds",
    documentation="HTTP request duration in seconds.",
    labelnames=["method", "path", "status"]
)


@app.middleware("http")
async def prometheus_monitoring(request: Request, call_next) -> None:
    """
    Record request related stats like: Total request count and request duration
    on prometheus.
    """

    http_request_total.labels(method=request.method,
                              path=request.url.path).inc()

    # Record the time when the request is received
    start_time = time.perf_counter()

    # Continue processing the request
    response: Response = await call_next(request)

    # Find how much time it took to process the request, In seconds.
    duration = time.perf_counter() - start_time

    http_request_duration.labels(
        method=request.method,
        path=request.url.path,
        status=response.status_code
    ).observe(duration)

    return response


@app.get("/health-check/", status_code=status.HTTP_200_OK)
async def health_check():
    return {"message": "Watcher is up & running"}
