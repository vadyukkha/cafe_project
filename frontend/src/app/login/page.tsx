"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "@/src/entities/auth/lib/api";
import { LoginForm } from "@/src/entities/auth/ui/LoginForm";
import { AuthStatusMessage } from "@/src/entities/auth/ui/AuthStatusMessage";
import { AuthLink } from "@/src/entities/auth/ui/AuthLink";
import { useDispatch } from "react-redux";
import { setAuthenticated } from "@/src/entities/auth/model/authSlice";

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [error, setError] = useState("");

    const handleSubmit = async (email: string, password: string) => {
        setError("");

        const result = await loginUser(email, password);
        if (!result.success) {
            setError(result.message || "Ошибка при логине");
            return;
        }
        dispatch(setAuthenticated(true));
        router.push("/");
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
