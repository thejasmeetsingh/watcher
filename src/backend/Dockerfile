FROM python:3.12-alpine

LABEL org.opencontainers.image.source="https://github.com/thejasmeetsingh/watcher"
LABEL org.opencontainers.image.description="Watcher Backend Image"
LABEL org.opencontainers.image.licenses="MIT"

RUN apk add --no-cache build-base libffi-dev
RUN pip install --upgrade pip

ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

RUN chmod +x ./entrypoint.sh

EXPOSE 8000

ENTRYPOINT [ "sh", "./entrypoint.sh" ]