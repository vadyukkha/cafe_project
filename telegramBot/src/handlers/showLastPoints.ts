import { Context } from 'telegraf';
import { logger } from '../utils/logger';
import { getLoyaltyCard } from '../services/api';
import { getMessageCups } from '../utils/getMessageCups';

export async function showLastPointsHandler(ctx: Context): Promise<void> {
    try {
        if (!ctx.from) {
            return;
        }

        const telegramId = String(ctx.from.id);
        const card = await getLoyaltyCard(telegramId);
        const totalPoints = card.data!.amount;
        let message = `${getMessageCups(totalPoints)}

Как получить баллы:

<b>При покупке в кофейне:</b>
1. Используйте команду /showQr чтобы получить QR-код
2. Покажите QR-код на кассе при оплате
3. Баллы будут начислены автоматиче
<b>При покупке онлайн:</b>
1. Привяжите бота к аккаунту
2. Просто сделайте заказ
`.trim();
        await ctx.reply(message,
            {
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: '🎫 Получить QR-код',
                                callback_data: 'get_qr'
                            },
                            {
                                text: '🔄 Обновить',
                                callback_data: 'refresh_history'
                            }
                        ]
                    ]
                }
            }
        );
        logger.info(`History shown for user ${ctx.from.id}`);

    } catch (error) {
        logger.error('Error in showLastPoints handler:', error);
        await ctx.reply('Не удалось получить историю. Попробуйте позже.');
    }
}