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
		"message": "User service is up & running",
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
	user, err := createUser(apiCfg, ctx.Context(), params)
	if err != nil {
		log.Errorln(err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Something went wrong. Please try after some time",
		})
	}

	userData := getUserProfileData(user)

	// Save user details in cache
	err = updateCachedUserDetails(ctx.Context(), userData)
	if err != nil {
		log.Errorln("Cache Error:", err)
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
		"data":    userData,
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

	user, ok := ctx.Locals("user").(*database.User)
	if !ok {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "Invalid credentials",
		})
	}

	params := new(Profile)

	// Parse the request data
	if err := ctx.BodyParser(params); err != nil {
		log.Errorln(err)
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request data format",
		})
	}

	// Pre-fill existing user data to perform the PATCH
	if params.Email == "" {
		params.Email = user.Email
	}

	if params.Name == "" {
		params.Name = user.Name
	}

	if params.Age < 12 && user.Age.Int32 > 12 {
		params.Age = user.Age.Int32
	}

	if params.Gender == "" && string(user.Gender.GenderType) != "" {
		params.Gender = user.Gender.GenderType
	}

	if len(params.Genres) == 0 && len(user.Genres) != 0 {
		params.Genres = user.Genres
	}

	// Validate the request data
	err := utils.ValidateRequestData(ctx.Context(), params)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	// Update user profile
	user, err = updateProfile(apiCfg, ctx.Context(), user.ID, params)
	if err != nil {
		log.Errorln(err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Something went wrong. Please try after some time",
		})
	}

	userData := getUserProfileData(user)

	// Update user details in cache
	err = updateCachedUserDetails(ctx.Context(), userData)
	if err != nil {
		log.Errorln("Cache Error:", err)
	}

	return ctx.JSON(fiber.Map{
		"message": "Profile updated successfully",
		"data":    userData,
	})
}

func (apiCfg *APIConfig) UpdatePassword(ctx *fiber.Ctx) error {
	ctx.Accepts("application/json")

	user, ok := ctx.Locals("user").(*database.User)
	if !ok {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "Invalid credentials",
		})
	}

	params := new(Password)

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

	// Check if new password and old password are same
	match, err := utils.CheckPasswordValid(params.Password, user.Password)
	if err != nil {
		log.Errorln(err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Something went wrong. Please try after some time",
		})
	}

	if match {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "New password should not be same as old password",
		})
	}

	// Generate hash of the password
	params.Password, err = utils.GetHashedPassword(params.Password)
	if err != nil {
		log.Errorln(err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Something went wrong. Please try after some time",
		})
	}

	// Update user password
	err = updatePassword(apiCfg, ctx.Context(), user.ID, params)
	if err != nil {
		log.Errorln(err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Something went wrong. Please try after some time",
		})
	}

	return ctx.JSON(fiber.Map{
		"message": "Password updated successfully",
	})
}

func (apiCfg *APIConfig) DeleteProfile(ctx *fiber.Ctx) error {
	user, ok := ctx.Locals("user").(*database.User)
	if !ok {
		return ctx.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "Invalid credentials",
		})
	}

	// Delete user profile
	err := deleteProfile(apiCfg, ctx.Context(), user.ID)
	if err != nil {
		log.Errorln(err)
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Something went wrong. Please try after some time",
		})
	}

	// Delete user details from cache
	err = deleteCachedUser(ctx.Context(), user.ID.String())
	if err != nil {
		log.Errorln("Cache Error:", err)
	}

	return ctx.JSON(fiber.Map{
		"message": "Profile deleted successfully",
	})
}
