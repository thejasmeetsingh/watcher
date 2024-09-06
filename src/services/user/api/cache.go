package api

import (
	"context"
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

	return conn.Set(ctx, user["id"].(string), user, 0).Err()
}

func deleteCachedUser(ctx context.Context, userID string) error {
	conn := getConn()
	defer conn.Close()

	return conn.Del(ctx, userID).Err()
}
