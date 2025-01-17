from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi_pagination import add_pagination
from prometheus_client import make_asgi_app

from middlewares.logger import LoggingMiddleware
from middlewares.prometheus import PrometheusMiddleware
from user.routes import router as u_router
from watchlist.routes import router as w_router
from content.routes import router as c_router


def get_app() -> FastAPI:
    _app = FastAPI()

    # Add CORS Middlewares
    _app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
    )

    _app.title = "Watcher"
    _app.description = "Watcher Backend"
    _app.include_router(u_router, prefix="/api/auth")
    _app.include_router(w_router, prefix="/api/watchlist")
    _app.include_router(c_router, prefix="/api/content")

    # Add prometheus ASGI app to route /metrics requests
    metrics_app = make_asgi_app()
    _app.mount("/metrics/", metrics_app)

    return _app


app = get_app()
add_pagination(app)

# Add custom middlewares
app.middleware("http")(LoggingMiddleware())
app.middleware("http")(PrometheusMiddleware())


@app.get("/health-check/", status_code=status.HTTP_200_OK)
async def health_check():
    return {"message": "Watcher is up & running"}
