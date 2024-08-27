#!/bin/sh

goose -dir ./sql/schema/ postgres $DB_URL up
go run main.go
