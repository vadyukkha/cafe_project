import { Context } from 'telegraf';
import { PointsService } from '../services/pointsService';
import { logger } from '../utils/logger';

export async function showLastPointsHandler(ctx: Context): Promise<void> {
  try {
    if (!ctx.from) {
      return;
    }

    const user = await PointsService.getUser(ctx.from.id);
    const history = await PointsService.getPurchaseHistory(ctx.from.id, 10);
    const totalPoints = await PointsService.getPoints(ctx.from.id);

    if (history.length === 0) {
      await ctx.reply(`
📭 История начислений пуста

У вас еще нет ни одной покупки с начислением баллов.

Как получить баллы:
1. Используйте команду /showQr чтобы получить QR-код
2. Покажите QR-код на кассе при оплате
3. Баллы будут начислены автоматически!

Ваш баланс: ${totalPoints} ⭐
      `.trim());
      return;
    }

    let historyText = `📊 История начислений\n\n`;
    
    history.forEach((purchase, index) => {
      const date = new Date(purchase.createdAt).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      historyText += `${index + 1}. ${date}\n`;
      historyText += `   ⭐ +${purchase.pointsEarned} баллов\n`;
      
      if (purchase.description) {
        historyText += `   📝 ${purchase.description}\n`;
      }
      
      historyText += '\n';
    });

    historyText += `\n💎 Всего баллов: ${totalPoints} ⭐`;

    await ctx.reply(historyText, {
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
    });

    logger.info(`History shown for user ${ctx.from.id}, ${history.length} records`);

  } catch (error) {
    logger.error('Error in showLastPoints handler:', error);
    await ctx.reply('Не удалось получить историю. Попробуйте позже.');
  }
}