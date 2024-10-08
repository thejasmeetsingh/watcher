package api

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/keyauth"
	"github.com/google/uuid"
	"github.com/thejasmeetsingh/watcher/src/services/user/utils"
)

func (apiCfg *APIConfig) JwtAuth(ctx *fiber.Ctx, token string) (bool, error) {
	claims, err := utils.VerifyToken(token)
	if err != nil {
		return false, keyauth.ErrMissingOrMalformedAPIKey
	}

	// Check the validity of the token
	if !time.Unix(claims.ExpiresAt.Unix(), 0).After(time.Now()) {
		return false, keyauth.ErrMissingOrMalformedAPIKey
	}

	// Convert the userID string to UUID
	userID, err := uuid.Parse(claims.Data)
	if err != nil {
		return false, keyauth.ErrMissingOrMalformedAPIKey
	}

	// Fetch user by ID from DB
	user, err := getUserByID(apiCfg, ctx.Context(), userID)
	if err != nil {
		return false, keyauth.ErrMissingOrMalformedAPIKey
	}

	// Set user details in context
	ctx.Locals("user", user)

	return true, nil
}
