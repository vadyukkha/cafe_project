import { LoginResponse, RegisterRequest, RegisterResponse, UserResponse } from '../model/types';
import apiConfig from '@/src/config/config';

export const registerUser = async (req: RegisterRequest):
    Promise<{ success: boolean; message?: string }> => {
    try {
        const res = await fetch(`${apiConfig.baseUrl}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
            credentials: "include",
        });

        const data: RegisterResponse = await res.json();
        return {
            success: res.ok,
            message: data.message,
        };
    } catch {
        return { success: false, message: 'Ошибка сервера' };
    }
};

export const loginUser = async (email: string, password: string):
    Promise<{ success: boolean; message?: string }> => {
    try {
        const res = await fetch(`${apiConfig.baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data: LoginResponse = await res.json();

        return { success: res.ok, message: data.message };
    } catch {
        return { success: false, message: 'Ошибка сервера' };
    }
};

export async function fetchMe() {
    const response = await fetch(`${apiConfig.baseUrl}/auth/me`, {
        method: "GET",
        cache: "no-store",
        credentials: "include",
    });

    const data: UserResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Не удалось загрузить профиль');
    }
    return {
        user: data.user!,
        loyaltyCard: data.card ?? null,
    };
}

export async function logoutUser() {
    interface LogoutResponse {
        message: string,
    };

    try {

        const res = await fetch(`${apiConfig.baseUrl}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        const data: LogoutResponse = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Не удалось выйти из профиля");
        }

        return { success: res.ok, message: data.message };
    } catch {
        return { success: false, message: 'Ошибка сервера' };
    }
}
