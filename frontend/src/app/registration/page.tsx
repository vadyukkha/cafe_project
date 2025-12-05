"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RegistrationForm } from "@/src/entities/auth/ui/RegistrationForm";
import { RegistrationStatus } from "@/src/entities/auth/ui/RegistrationStatus";
import { registerUser } from "@/src/entities/auth/lib/api";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const onSubmit = async (data: { name: string; email: string; password: string }) => {
        registerUser(data);
        setTimeout(() => router.push("/login"), 2000);
    };

    return (
        <main>
            <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
                <h1>Зарегистрироваться</h1>
                <RegistrationForm onSubmit={onSubmit} />
                <RegistrationStatus error={error} success={success} />
            </div>
        </main>
    );
}
