package api

type Signup struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
	Name     string `json:"name" validate:"required,max=50"`
}

type Login struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type Profile struct {
	Email  string   `json:"email" validate:"email"`
	Name   string   `json:"name" validate:"max=50"`
	Age    int32    `json:"age" validate:"min=12"`
	Gender string   `json:"gender" validate:"min=1"`
	Genres []string `json:"genres"`
}

type Password struct {
	Password string `json:"password" validate:"required,min=8"`
}
