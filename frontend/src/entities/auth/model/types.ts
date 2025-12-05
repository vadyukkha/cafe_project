export interface RegisterResponse {
    message: string;
    user?: {
        id: string;
    }
}

export interface RegisterRequest {
    email: string
    password: string
    name: string
}

export interface LoginResponse {
    access_token: string;
    message?: string;
}
