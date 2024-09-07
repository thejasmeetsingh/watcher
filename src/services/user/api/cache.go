package api

import (
	"context"
	"encoding/json"
	"os"

	"github.com/redis/go-redis/v9"
)

func getConn() *redis.Client {
	host := os.Getenv("REDIS_HOST")

	return redis.NewClient(&redis.Options{
		Addr:     host,
		Password: "",
		DB:       0,
	})
}

func updateCachedUserDetails(ctx context.Context, user map[string]interface{}) error {
	conn := getConn()
	defer conn.Close()

	userData, err := json.Marshal(user)
	if err != nil {
		return err
	}

	return conn.Set(ctx, user["id"].(string), userData, 0).Err()
}

func deleteCachedUser(ctx context.Context, userID string) error {
	conn := getConn()
	defer conn.Close()

	return conn.Del(ctx, userID).Err()
}
