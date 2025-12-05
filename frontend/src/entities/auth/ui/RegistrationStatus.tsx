interface RegistrationStatusProps {
    error: string;
    success: string;
}

export function RegistrationStatus({ error, success }: RegistrationStatusProps) {
    return (
        <>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
        </>
    );
}
