FROM python:3.12-alpine

RUN apk add --no-cache build-base libffi-dev
RUN pip install --upgrade pip

ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

EXPOSE 3000

ENTRYPOINT [ "fastapi", "dev", "main.py", "--host", "0.0.0.0", "--port", "3000" ]