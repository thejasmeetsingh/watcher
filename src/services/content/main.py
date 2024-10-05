from fastapi import FastAPI, status

from api.routes import router


def get_app() -> FastAPI:
    _app = FastAPI()

    _app.title = "Watcher"
    _app.description = "Content Service"
    _app.include_router(router, prefix="/api")

    return _app


app = get_app()


@app.get("/health-check/", status_code=status.HTTP_200_OK)
async def health_check():
    return {"message": "Content service is up & running"}
