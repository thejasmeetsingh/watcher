package api

import (
	"github.com/gofiber/fiber/v2"
)

func HealthCheck(ctx *fiber.Ctx) error {
	return ctx.JSON(fiber.Map{
		"message": "user services are up and running",
	})
}

func (apiCfg *APIConfig) Signup(ctx *fiber.Ctx) error {
	return ctx.JSON(fiber.Map{
		"message": "Create user account",
	})
}

func (apiCfg *APIConfig) Login(ctx *fiber.Ctx) error {
	return ctx.JSON(fiber.Map{
		"message": "Login the user",
	})
}

func (apiCfg *APIConfig) UpdateProfile(ctx *fiber.Ctx) error {
	return ctx.JSON(fiber.Map{
		"message": "Update user profile",
	})
}

func (apiCfg *APIConfig) UpdatePassword(ctx *fiber.Ctx) error {
	return ctx.JSON(fiber.Map{
		"message": "Update user password",
	})
}

func (apiCfg *APIConfig) DeleteProfile(ctx *fiber.Ctx) error {
	return ctx.JSON(fiber.Map{
		"message": "Delete user profile",
	})
}
