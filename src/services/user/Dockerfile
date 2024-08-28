FROM golang:1.22.6-alpine

RUN apk add --no-cache build-base curl

RUN curl https://downloads.sqlc.dev/sqlc_1.22.0_linux_amd64.tar.gz --output sqlc.tar.gz
RUN tar -xvzf sqlc.tar.gz
RUN mv sqlc bin/

RUN curl -fsSL https://raw.githubusercontent.com/pressly/goose/master/install.sh | sh

WORKDIR /go/src/app

COPY . .

RUN go get -d -v ./...

EXPOSE 3000

CMD [ "go", "run", "main.go" ]