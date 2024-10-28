from fastapi import FastAPI, status
from prometheus_client import make_asgi_app

from api.routes import router
from api.middleware import prometheus_monitoring


def get_app() -> FastAPI:
    _app = FastAPI()

    _app.title = "Watcher"
    _app.description = "Content Service"
    _app.include_router(router, prefix="/api")

    # Add prometheus middleware
    _app.middleware("http")(prometheus_monitoring)

    # Add prometheus ASGI middleware to route /metrics requests
    metrics_app = make_asgi_app()
    _app.mount("/metrics/", metrics_app)

    return _app


app = get_app()


@app.get("/health-check/", status_code=status.HTTP_200_OK)
async def health_check():
    return {"message": "Content service is up & running"}
