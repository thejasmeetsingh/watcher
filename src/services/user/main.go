package main

import (
	"context"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5"
	log "github.com/sirupsen/logrus"
	"github.com/thejasmeetsingh/watcher/src/services/user/api"
	"github.com/thejasmeetsingh/watcher/src/services/user/database"
)

func main() {
	app := fiber.New()

	conn, err := pgx.Connect(context.Background(), os.Getenv("DB_URL"))
	if err != nil {
		log.Fatalln("error while connecting to DB: ", err)
	}
	defer conn.Close(context.Background())

	apiCfg := api.APIConfig{
		DB:      conn,
		Queries: database.New(conn),
	}

	app.Get("/", api.HealthCheck)
	app.Post("/signup/", apiCfg.Signup)
	app.Post("/login/", apiCfg.Login)
	app.Patch("/profile/", apiCfg.UpdatePassword)
	app.Put("/password/", apiCfg.UpdatePassword)
	app.Delete("/delete/", apiCfg.DeleteProfile)

	log.Fatalln(app.Listen(":3000"))
}
