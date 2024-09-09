FROM node:20.11.1-alpine

RUN apk add --no-cache build-base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm", "start" ]
