-- name: CreateUser :one
INSERT INTO users (id, created_at, modified_at, email, password, name, age, gender, genres) 
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;

-- name: GetUserById :one
SELECT * FROM users WHERE id=$1 FOR UPDATE NOWAIT;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email=$1 FOR UPDATE NOWAIT;

-- name: UpdateUserDetails :one
UPDATE users SET email=$1, name=$2, age=$3, gender=$4, genres=$5, modified_at=$6
WHERE id=$7
RETURNING *;

-- name: UpdateUserPassword :exec
UPDATE users SET password=$1, modified_at=$2
WHERE id=$3;

-- name: DeleteUser :exec
DELETE FROM users WHERE id=$1;