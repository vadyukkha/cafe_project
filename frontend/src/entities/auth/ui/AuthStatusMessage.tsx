interface AuthStatusMessageProps {
  error: string;
}

export function AuthStatusMessage({ error }: AuthStatusMessageProps) {
  return error ? (
    <p style={{ color: "red", marginTop: 10 }}>{error}</p>
  ) : null;
}
