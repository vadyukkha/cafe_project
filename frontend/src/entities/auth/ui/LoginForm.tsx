import { FormEvent, useState } from "react";
import { validateLoginData } from "../lib/validation";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationResult = validateLoginData(email, password);
    if (validationResult) {
      setValidationError(validationResult);
      return;
    }

    setValidationError(null);
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
      <button type="submit">Войти</button>

      {validationError && (
        <p style={{ color: "red", fontSize: "0.875rem", marginTop: 5 }}>
          {validationError}
        </p>
      )}
    </form>
  );
}
