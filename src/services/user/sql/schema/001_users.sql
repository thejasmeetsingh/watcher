-- +goose Up

-- ('M', 'Male')
-- ('F', 'Female')
-- ('O', 'Other')
CREATE TYPE gender_type AS ENUM ('M', 'F', 'O');

CREATE TABLE users (
    id UUID PRIMARY KEY,
    created_at TIMESTAMP NOT NULL,
    modified_at TIMESTAMP NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name VARCHAR(50) NOT NULL,
    age INT CHECK (age >= 12), 
    gender gender_type,
    genres TEXT[]
);

-- +goose Down
DROP TABLE users;