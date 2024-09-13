from fastapi import FastAPI, status


app = FastAPI()
app.title = "Watcher"
app.description = "Content Service"


@app.get("/health-check/", status_code=status.HTTP_200_OK)
async def health_check():
    return {"message": "Content service is up & running"}
