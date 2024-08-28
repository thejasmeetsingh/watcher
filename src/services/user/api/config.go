package api

import (
	"github.com/jackc/pgx/v5"
	"github.com/thejasmeetsingh/watcher/src/services/user/database"
)

type APIConfig struct {
	DB      *pgx.Conn
	Queries *database.Queries
}
