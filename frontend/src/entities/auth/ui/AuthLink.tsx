interface AuthLinkProps {
  onRegister: () => void;
}

export function AuthLink({ onRegister }: AuthLinkProps) {
  return (
    <p style={{ marginTop: 20 }}>
      Нет аккаунта?{" "}
      <button
        style={{ color: "blue", cursor: "pointer", background: "none", border: "none", padding: 0 }}
        onClick={onRegister}
      >
        Зарегистрироваться
      </button>
    </p>
  );
}
