import { FormEvent, useState } from "react";
import { validateRegistrationData } from "../lib/validation";

interface RegistrationFormProps {
    onSubmit: (data: { name: string; email: string; password: string }) => void;
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationResult = validateRegistrationData(name, password);
        if (validationResult) {
            setValidationError(validationResult);
            return;
        }

        setValidationError(null);
        onSubmit({ name, email, password });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">ЖМИ ЖМИ ЖМИ</button>

            {validationError && (
                <p style={{ color: "red", fontSize: "0.875rem" }}>
                    {validationError}
                </p>
            )}
        </form>
    );
}
