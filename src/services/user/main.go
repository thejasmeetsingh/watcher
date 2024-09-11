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

	apiRouter := app.Group("/api/")

	apiRouter.Get("health-check/", api.HealthCheck)
	apiRouter.Post("signup/", apiCfg.Signup)
	apiRouter.Post("login/", apiCfg.Login)

	authRouter := apiRouter.Group("")
	authRouter.Use(keyauth.New(keyauth.Config{
		Validator: apiCfg.JwtAuth,
	}))

	authRouter.Patch("profile/", apiCfg.UpdateProfile)
	authRouter.Delete("profile/", apiCfg.DeleteProfile)
	authRouter.Put("password/", apiCfg.UpdatePassword)

	log.Fatalln(app.Listen(":3000"))
}
