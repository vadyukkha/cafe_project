"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "@/src/entities/auth/lib/api";
import { LoginForm } from "@/src/entities/auth/ui/LoginForm";
import { AuthStatusMessage } from "@/src/entities/auth/ui/AuthStatusMessage";
import { AuthLink } from "@/src/entities/auth/ui/AuthLink";
import { setCredentials } from "@/src/entities/auth/model/authSlice";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = async (email: string, password: string) => {
        setError("");
        try {
            const result = await loginUser(email, password);
            if (!result.success) {
                setError(result.message || "Ошибка при логине");
                return;
            }

            dispatch(setCredentials({ accessToken: result.access_token }));

            document.cookie = `auth_token=${result.access_token}; ` +
                `path=/; ` +
                `max-age=31536000; ` +
                // `HttpOnly=false; ` + ??? How to setup this piece of shit ???
                `Secure=${process.env.NODE_ENV === 'production'}; ` +
                `SameSite=Lax`;

            router.push("/");
        } catch (err) {
            setError("Ошибка сервера");
            console.error(err);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
            <h1>Авторизация</h1>
            <LoginForm onSubmit={handleSubmit} />
            <AuthStatusMessage error={error} />
            <AuthLink onRegister={() => router.push("/registration")} />
        </div>
    );
}
