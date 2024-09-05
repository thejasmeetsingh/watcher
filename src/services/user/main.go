package main

import (
	"context"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/keyauth"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"github.com/jackc/pgx/v5"
	log "github.com/sirupsen/logrus"
	"github.com/thejasmeetsingh/watcher/src/services/user/api"
	"github.com/thejasmeetsingh/watcher/src/services/user/database"
)

func main() {
	app := fiber.New(fiber.Config{})
	app.Use(requestid.New())
	app.Use(logger.New(logger.Config{
		Format: "[${ip}]:${port} ${status} - ${method} ${path}\n",
	}))

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

	auth := app.Group("")
	auth.Use(keyauth.New(keyauth.Config{
		Validator: apiCfg.JwtAuth,
	}))

	auth.Patch("/profile/", apiCfg.UpdateProfile)
	auth.Delete("/profile/", apiCfg.DeleteProfile)
	auth.Put("/password/", apiCfg.UpdatePassword)

	log.Fatalln(app.Listen(":3000"))
}
