import { Context } from 'telegraf';
import { QrService } from '../services/qrService';
import { PointsService } from '../services/pointsService';
import { logger } from '../utils/logger';

export async function showQrHandler(ctx: Context): Promise<void> {
  try {
    if (!ctx.from) {
      return;
    }

    const user = await PointsService.getUser(ctx.from.id);
    const points = await PointsService.getPoints(ctx.from.id);
    const qrCode = await QrService.generateUserQr(user.id, points);

    const base64Data = qrCode.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const caption = `
🎫 Ваш персональный QR-код

ID пользователя: ${user.id}
Текущие баллы: ${points} ⭐
Имя: ${user.name}

Инструкция:
1. Покажите этот код на кассе
2. Бариста отсканирует его
3. Баллы будут начислены автоматически

QR-код обновляется при каждом запросе.
    `.trim();

    await ctx.replyWithPhoto(
      { source: buffer },
      {
        caption,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🔄 Обновить QR-код',
                callback_data: 'refresh_qr'
              }
            ],
            [
              {
                text: '📊 Мои баллы',
                callback_data: 'show_points'
              }
            ]
          ]
        }
      }
    );

    logger.info(`QR code shown for user ${ctx.from.id}`);

  } catch (error) {
    logger.error('Error in showQr handler:', error);
    await ctx.reply('Не удалось сгенерировать QR-код. Попробуйте позже.');
  }
}