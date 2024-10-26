package main

import (
	"context"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/adaptor"
	"github.com/gofiber/fiber/v2/middleware/keyauth"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/monitor"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"github.com/jackc/pgx/v5"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	log "github.com/sirupsen/logrus"
	"github.com/thejasmeetsingh/watcher/src/services/user/api"
	"github.com/thejasmeetsingh/watcher/src/services/user/database"
)

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		port = "3000"
	}

	app := fiber.New(fiber.Config{})
	app.Use(requestid.New())
	app.Use(logger.New(logger.Config{
		Format: "[${ip}]:${port} ${status} - ${method} ${path}\n",
	}))

	// A health check API for determining the readiness of the app
	app.Get("/health-check/", func(ctx *fiber.Ctx) error {
		return ctx.JSON(fiber.Map{
			"message": "User service is up & running",
		})
	})

	// Get DB connection
	conn, err := pgx.Connect(context.Background(), os.Getenv("DB_URL"))
	if err != nil {
		log.Fatalln("error while connecting to DB: ", err)
	}
	defer conn.Close(context.Background())

	apiCfg := api.APIConfig{
		DB:      conn,
		Queries: database.New(conn),
	}

	// Add prometheus middleware, handler and fiber monitor
	app.Use(api.PrometheusMonitoring)
	app.Get("/metrics/", adaptor.HTTPHandler(promhttp.Handler()))
	app.Get("/monitor/", monitor.New(monitor.Config{Title: "Monitor User Service"}))

	// Initialize prometheus
	httpRequestsTotal := api.GetPromRequestTotal()
	httpRequestDuration := api.GetPromRequestDuration()

	prometheus.MustRegister(httpRequestsTotal)
	prometheus.MustRegister(httpRequestDuration)

	// Configure routes
	apiRouter := app.Group("/api/")

	apiRouter.Post("signup/", apiCfg.Signup)
	apiRouter.Post("login/", apiCfg.Login)

	authRouter := apiRouter.Group("")
	authRouter.Use(keyauth.New(keyauth.Config{
		Validator: apiCfg.JwtAuth,
	}))

	authRouter.Patch("profile/", apiCfg.UpdateProfile)
	authRouter.Delete("profile/", apiCfg.DeleteProfile)
	authRouter.Put("password/", apiCfg.UpdatePassword)

	log.Fatalln(app.Listen(":" + port))
}
