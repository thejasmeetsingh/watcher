package api

import (
	"context"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/thejasmeetsingh/watcher/src/services/user/database"
)

func getUserByEmail(apiCfg *APIConfig, ctx context.Context, email string) (*database.User, error) {
	user, err := apiCfg.Queries.GetUserByEmail(ctx, strings.ToLower(email))
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func getUserByID(apiCfg *APIConfig, ctx context.Context, userID uuid.UUID) (*database.User, error) {
	user, err := apiCfg.Queries.GetUserById(ctx, userID)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func createUser(apiCfg *APIConfig, ctx context.Context, params Signup) (*database.User, error) {
	tx, err := apiCfg.DB.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := apiCfg.Queries.WithTx(tx)
	currentTime := time.Now().UTC()

	user, err := qtx.CreateUser(ctx, database.CreateUserParams{
		ID: uuid.New(),
		CreatedAt: pgtype.Timestamp{
			Time:  currentTime,
			Valid: true,
		},
		ModifiedAt: pgtype.Timestamp{
			Time:  currentTime,
			Valid: true,
		},
		Email:    strings.ToLower(params.Email),
		Password: params.Password,
		Name:     params.Name,
	})

	if err != nil {
		return nil, err
	}

	err = tx.Commit(ctx)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func updateProfile(apiCfg *APIConfig, ctx context.Context, userID uuid.UUID, params Profile) (*database.User, error) {
	tx, err := apiCfg.DB.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := apiCfg.Queries.WithTx(tx)
	currentTime := time.Now().UTC()

	user, err := qtx.UpdateUserDetails(ctx, database.UpdateUserDetailsParams{
		ID:     userID,
		Email:  strings.ToLower(params.Email),
		Name:   params.Name,
		Genres: params.Genres,
		Age: pgtype.Int4{
			Int32: params.Age,
			Valid: true,
		},
		Gender: database.NullGenderType{
			GenderType: database.GenderType(params.Gender),
			Valid:      true,
		},
		ModifiedAt: pgtype.Timestamp{
			Time:  currentTime,
			Valid: true,
		},
	})

	if err != nil {
		return nil, err
	}

	err = tx.Commit(ctx)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func updatePassword(apiCfg *APIConfig, ctx context.Context, userID uuid.UUID, params Password) error {
	tx, err := apiCfg.DB.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := apiCfg.Queries.WithTx(tx)
	currentTime := time.Now().UTC()

	err = qtx.UpdateUserPassword(ctx, database.UpdateUserPasswordParams{
		ID:       userID,
		Password: params.Password,
		ModifiedAt: pgtype.Timestamp{
			Time:  currentTime,
			Valid: true,
		},
	})

	if err != nil {
		return err
	}

	err = tx.Commit(ctx)
	if err != nil {
		return err
	}

	return nil
}

func deleteProfile(apiCfg *APIConfig, ctx context.Context, userID uuid.UUID) error {
	tx, err := apiCfg.DB.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	qtx := apiCfg.Queries.WithTx(tx)

	err = qtx.DeleteUser(ctx, userID)

	if err != nil {
		return err
	}

	err = tx.Commit(ctx)
	if err != nil {
		return err
	}

	return nil
}
