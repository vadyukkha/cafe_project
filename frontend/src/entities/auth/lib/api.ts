import { RegisterRequest, RegisterResponse, LoginResponse } from '../model/types';

export const registerUser = async (req: RegisterRequest):
    Promise<{ success: boolean; message?: string }> => {
    try {
        const res = await fetch('http://localhost:3000/api/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req),
        });

        const data: RegisterResponse = await res.json();
        return {
            success: res.ok,
            message: data.message,
        };
    } catch (error) {
        return { success: false, message: 'Ошибка сервера' };
    }
};

export const loginUser = async (
    email: string,
    password: string
): Promise<{ success: boolean; access_token?: string; message?: string }> => {
    try {
        const res = await fetch("http://localhost:3000/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data: LoginResponse = await res.json();

        return {
            success: res.ok,
            access_token: data.access_token,
            message: data.message,
        };
    } catch (error) {
        return { success: false, message: "Ошибка сервера" };
    }
};
