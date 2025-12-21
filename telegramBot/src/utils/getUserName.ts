import { Context } from "telegraf";

// Функция для получения имени пользователя из контекста
export function getUserNameFromContext(ctx: Context): string {
    if (!ctx.from) {
        return 'Гость';
    }

    const { first_name, last_name, username } = ctx.from;

    if (first_name && last_name) {
        return `${first_name} ${last_name}`;
    } else if (first_name) {
        return first_name;
    } else if (username) {
        return `@${username}`;
    } else {
        return `User_${ctx.from.id}`;
    }
}
