import { Context } from 'telegraf';
import { QrService } from '../services/qrService';
import { PointsService } from '../services/pointsService';
import { logger } from '../utils/logger';

export async function showQrHandler(ctx: Context): Promise<void> {
  try {
    if (!ctx.from) {
      return;
    }

    // Получаем имя пользователя
    const userName = getUserNameFromContext(ctx);
    
    // Обновляем имя пользователя, если оно изменилось
    const user = await PointsService.getOrCreateUser(ctx.from.id, userName);
    const points = await PointsService.getPoints(ctx.from.id);
    
    logger.info(`Generating QR code for user ${ctx.from.id} (${userName})`);
    
    const qrCode = await QrService.generateUserQr(user.id, points);

    const base64Data = qrCode.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    const caption = `🎫 Ваш персональный QR-код\n\nID пользователя: ${user.id}\nТекущие баллы: ${points} ⭐\nИмя: ${userName}\n\nИнструкция:\n1. Покажите этот код на кассе\n2. Бариста отсканирует его\n3. Баллы будут начислены автоматически\n\nQR-код обновляется при каждом запросе.`;

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

    logger.info(`QR code shown for user ${ctx.from.id} (${userName})`);

  } catch (error) {
    logger.error('Error in showQr handler:', error);
    await ctx.reply('Не удалось сгенерировать QR-код. Попробуйте позже.');
  }
}

// Вспомогательная функция для получения имени
function getUserNameFromContext(ctx: Context): string {
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