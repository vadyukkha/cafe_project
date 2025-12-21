import { Context } from 'telegraf';
import { QrService } from '../services/qrService';
import { getLoyaltyCard } from '../services/api';
import { logger } from '../utils/logger';
import { getMessageCups } from '../utils/getMessageCups';
import { getUserNameFromContext } from '../utils/getUserName';

export async function showQrHandler(ctx: Context): Promise<void> {
    try {
        if (!ctx.from) {
            return;
        }

        // Получаем имя пользователя
        const userName = getUserNameFromContext(ctx);

        // Обновляем имя пользователя, если оно изменилось
        const telegramId = String(ctx.from.id);
        const card = await getLoyaltyCard(telegramId);

        const points = card.data!.amount;

        logger.info(`Generating QR code for user ${ctx.from.id} (${userName})`);

        const qrCode = await QrService.generateUserQr(ctx.from.id, points);

        const base64Data = qrCode.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        const caption = `🎫 Ваш персональный QR-код

${getMessageCups(points)}

Имя: ${userName}

Инструкция:
1. Покажите этот код на кассе
2. Бариста отсканирует его
3. Баллы будут начислены автоматически

Если что-то пошло не так нажмите «🔄 Обновить QR-код»`;
        await ctx.replyWithPhoto(
            { source: buffer },
            {
              caption,
              reply_markup: {
                inline_keyboard: [
                  [
                    { text: '🔄 Обновить QR-код', callback_data: 'refresh_qr' },
                    { text: '📊 Мои баллы', callback_data: 'show_points' }
                  ]
                ]
              }
            }
        );

        logger.info(`QR code shown for user ${ctx.from.id} (${userName})`);

    } catch (error) {
        logger.error('Error in showQr handler:', error);
        await ctx.reply('Не удалось сгенерировать QR-код. Попробуйте позже.');
    }
}
