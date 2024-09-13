package utils

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	Data string `json:"data"`
	jwt.RegisteredClaims
}

func getSecretKey() []byte {
	secretKey := os.Getenv("SECRET_KEY")
	if secretKey == "" {
		secretKey = "random-secret-123"
	}

	return []byte(secretKey)
}

// Return the auth token expiry duration
func getTokenExpiration() time.Duration {
	tokenExp := os.Getenv("TOKEN_EXP")

	_tokenExpiration, err := strconv.Atoi(tokenExp)
	if err != nil {
		_tokenExpiration = 7
	}

	return time.Hour * 24 * time.Duration(_tokenExpiration)
}

// Generate the auth token and encode the given userID string
func GenerateTokens(userID string) (string, error) {
	tokenExp := getTokenExpiration()
	secretKey := getSecretKey()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &Claims{
		Data: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(tokenExp)),
		},
	})

	tokenString, err := token.SignedString(secretKey)

	if err != nil {
		return tokenString, err
	}

	return tokenString, nil
}

// Verify the given token string is valid or not and return the respected token claim which contains the encoded data
func VerifyToken(token string) (*Claims, error) {
	secretKey := getSecretKey()

	_token, err := jwt.ParseWithClaims(token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := _token.Claims.(*Claims); ok && _token.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("invalid token string")
}
