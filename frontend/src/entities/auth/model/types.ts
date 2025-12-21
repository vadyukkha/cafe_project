import { Role } from '@/src/shared/enums/role';

export interface RegisterResponse {
    message: string;
    user?: { id: string; }
}

export interface RegisterRequest {
    email: string
    password: string
    name: string
}

export interface LoginResponse {
    message?: string;
}

export interface User {
    name: string;
    id: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
}

export interface LoyaltyCard {
    id: string;
}

export interface UserResponse {
    message: string;
    user?: User;
    card?: LoyaltyCard | null;
}
