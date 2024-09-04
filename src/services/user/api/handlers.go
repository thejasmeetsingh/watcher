package api

import (
	"github.com/gofiber/fiber/v2"
	log "github.com/sirupsen/logrus"
	"github.com/thejasmeetsingh/watcher/src/services/user/database"
	"github.com/thejasmeetsingh/watcher/src/services/user/utils"
)

func getUserProfileData(user *database.User) fiber.Map {
	return fiber.Map{
		"id":          user.ID.String(),
		"email":       user.Email,
		"name":        user.Name,
		"age":         user.Age,
		"gender":      string(user.Gender.GenderType),
		"genres":      user.Genres,
		"created_at":  user.CreatedAt.Time,
		"modified_at": user.ModifiedAt.Time,
	}
}

func HealthCheck(ctx *fiber.Ctx) error {
	return ctx.JSON(fiber.Map{
		"message": "user services are up and running",
	})
}

func (apiCfg *APIConfig) Signup(ctx *fiber.Ctx) error {
	ctx.Accepts("application/json")

	params := new(Signup)

	// Parse the request data
	if err := ctx.BodyParser(params); err != nil {
		log.Errorln(err)
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request data format",
		})
	}

	// Validate the request data
	err := utils.ValidateRequestData(ctx.Context(), params)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Check if user with the given email ID already exists
	_, err = getUserByEmail(apiCfg, ctx.Context(), params.Email)
	if err == nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Email already exists",
		})
	}

	// Generate password hash for storing in DB
	password, err := utils.GetHashedPassword(params.Password)
	if err != nil {
		log.Errorln(err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Something went wrong. Please try after some time",
		})
	}

	params.Password = password

	// Create user in DB
	user, err := createUser(apiCfg, ctx.Context(), *params)
	if err != nil {
		log.Errorln(err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Something went wrong. Please try after some time",
		})
	}

	// Generate Auth tokens
	tokens, err := utils.GenerateTokens(user.ID.String())
	if err != nil {
		log.Errorln(err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Something went wrong. Please try after some time",
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Account created successfully",
		"data":    getUserProfileData(user),
		"tokens":  tokens,
	})
}

func (apiCfg *APIConfig) Login(ctx *fiber.Ctx) error {
	ctx.Accepts("application/json")

	params := new(Login)

	// Parse the request data
	if err := ctx.BodyParser(params); err != nil {
		log.Errorln(err)
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request data format",
		})
	}

	// Validate the request data
	err := utils.ValidateRequestData(ctx.Context(), params)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Check if user with the given email ID exists
	user, err := getUserByEmail(apiCfg, ctx.Context(), params.Email)
	if err != nil {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "Email does not exists",
		})
	}

	// Check the given password with hashed password stored in DB
	match, err := utils.CheckPasswordValid(params.Password, user.Password)
	if err != nil || !match {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "Invalid login credentials",
		})
	}

	// Generate Auth tokens
	tokens, err := utils.GenerateTokens(user.ID.String())
	if err != nil {
		log.Errorln(err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Something went wrong. Please try after some time",
		})
	}

	return ctx.JSON(fiber.Map{
		"message": "Logged in successfully",
		"data":    getUserProfileData(user),
		"tokens":  tokens,
	})
}

func (apiCfg *APIConfig) UpdateProfile(ctx *fiber.Ctx) error {
	ctx.Accepts("application/json")

	var params Profile

	if err := ctx.BodyParser(params); err != nil {
		return err
	}

	log.Infoln(params)

	return ctx.JSON(fiber.Map{
		"message": "Update user profile",
	})
}

func (apiCfg *APIConfig) UpdatePassword(ctx *fiber.Ctx) error {
	ctx.Accepts("application/json")

	var params Password

	if err := ctx.BodyParser(params); err != nil {
		return err
	}

	log.Infoln(params)

	return ctx.JSON(fiber.Map{
		"message": "Update user password",
	})
}

func (apiCfg *APIConfig) DeleteProfile(ctx *fiber.Ctx) error {
	return ctx.JSON(fiber.Map{
		"message": "Delete user profile",
	})
}
