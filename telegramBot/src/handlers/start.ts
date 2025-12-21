import { Context } from 'telegraf';
import { logger } from '../utils/logger';
import {
    getLoyaltyCard, createLoyaltyCard, attachLoyaltyCardToUser
} from '../services/api';
import { getMessageCups } from '../utils/getMessageCups'
import { getUserNameFromContext } from '../utils/getUserName';

export async function startHandler(ctx: Context): Promise<void> {
    try {
        if (!ctx.from) {
            logger.warn('Start command called without user info');
            return;
        }

        const telegramId = String(ctx.from.id);
        const userName = getUserNameFromContext(ctx);

        // --- формируем приветственное сообщение ---
        let welcomeMessage = `☕ Добро пожаловать в нашу кофейню!\n\nПривет, ${userName}!\n\n`;

        // --- достаём payload из /start <payload> ---
        let payload: string | null = null;
        if (ctx.message && 'text' in ctx.message) {
            const parts = ctx.message.text.split(' ');
            if (parts.length > 1 && parts[1].trim().length > 0) {
                payload = parts[1].trim();
            }
        }

        logger.info(
            `Start command from ${telegramId} (${userName}), payload = ${payload ?? 'NONE'}`
        );
        let card = await getLoyaltyCard(telegramId);
        if (!card.success) {
            card = await createLoyaltyCard(telegramId);
            welcomeMessage += `✅Ваша карта лояльности успешно создана\n\n`;
        }

        // --- если есть payload, привязываем карту к userId = payload ---
        if (payload) {
            const res = await attachLoyaltyCardToUser({
                telegramId,
                userId: payload,
            });
            if (!res.success) {
                logger.info(
                    `${res.message}`
                );
                welcomeMessage += `Эта карта уже другому привязана\n\n`;
            }
            else {
                welcomeMessage += `✅Ваша карта лояльности успешно привязана\n\n`
                logger.info(
                    `Card attached to userId=${payload} for telegramId=${telegramId}`
                );
            }
        }

        // берём количество баллов из карты (если нужно — из PointsService, как раньше)
        card = await getLoyaltyCard(telegramId);
        const points = card.data!.amount;

        welcomeMessage +=`
${getMessageCups(points)}

Доступные команды:
/showQr - Получить QR-код для начисления баллов
/showLastPoints - История начислений
/help - Помощь по командам

Как это работает:
1. Покажите QR-код на кассе
2. Получайте баллы за покупки
3. Обменивайте баллы на напитки!

Желаем вам приятного кофе! ☕`.trim();

        await ctx.reply(welcomeMessage);

        logger.info(`Start handler executed for user ${telegramId} (${userName})`);
    } catch (error) {
        logger.error('Error in start handler:', error);

        if (ctx && ctx.reply) {
            await ctx
                .reply('Произошла ошибка. Пожалуйста, попробуйте позже.')
                .catch((e) => logger.error('Failed to send error message:', e));
        }
    }
}
