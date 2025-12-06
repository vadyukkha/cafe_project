export const validateRegistrationData = (name: string, password: string) => {
    if (name.length < 1) {
        return 'Имя не может быть пустым';
    }
    if (password.length < 8) {
        return 'Пароль должен быть не менее 8 символов';
    }
    return null;
};

export const validateLoginData = (email: string, password: string): string | null => {
    if (!email) {
        return "Email обязателен";
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return "Некорректный email";
    }
    if (password.length < 6) {
        return "Пароль должен быть не менее 6 символов";
    }
    return null;
};
