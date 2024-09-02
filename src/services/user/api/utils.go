package api

import (
	"context"
	"fmt"

	"github.com/go-playground/validator/v10"
)

func getCustomErrorMessage(field, tag string) string {
	switch tag {
	case "required":
		return fmt.Sprintf("%s is required.", field)
	case "min":
		return fmt.Sprintf("%s must be at least %s characters long.", field, tag)
	case "max":
		return fmt.Sprintf("%s cannot be longer than %s characters.", field, tag)
	case "email":
		return fmt.Sprintf("%s must be a valid email address.", field)
	case "gte":
		return fmt.Sprintf("%s must be greater than or equal to %s.", field, tag)
	default:
		return fmt.Sprintf("%s is invalid.", field)
	}
}

func validateRequestData(ctx context.Context, params interface{}) error {
	validate := validator.New()

	err := validate.StructCtx(ctx, params)
	if err != nil {
		if valiationErrors, ok := err.(validator.ValidationErrors); ok {
			field := valiationErrors[0].Field()
			tag := valiationErrors[0].Tag()
			return fmt.Errorf("validation failed for field '%s': %s", field, getCustomErrorMessage(field, tag))
		}
		return fmt.Errorf("validation error: %s", err)
	}
	return nil
}
