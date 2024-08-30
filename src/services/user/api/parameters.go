package api

type credentials struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type profile struct {
	Email  string   `json:"email" validate:"email"`
	Name   string   `json:"name" validate:max=50`
	Age    int      `json:"age" validate:min=12`
	Gender string   `json:"gender" validate:min=1`
	Genres []string `json:"genres"`
}

type password struct {
	Password string `json:"password" validate:"required,min=8"`
}
