import { Context } from 'telegraf';
import { PointsService } from '../services/pointsService';
import { logger } from '../utils/logger';

export async function startHandler(ctx: Context): Promise<void> {
  try {
    if (!ctx.from) {
      logger.warn('Start command called without user info');
      return;
    }

    const user = await PointsService.getUser(ctx.from.id);
    const points = await PointsService.getPoints(ctx.from.id);

    // Используем имя из Telegram или дефолтное
    const userName = ctx.from.first_name || ctx.from.username || user.name;

    const welcomeMessage = `
☕ Добро пожаловать в нашу кофейню!

Привет, ${userName}! Рады видеть вас в нашем приложении.

Ваши текущие баллы: ${points} ⭐

Доступные команды:
/showQr - Получить QR-код для начисления баллов
/showLastPoints - История начислений
/help - Помощь по командам

Как это работает:
1. Покажите QR-код на кассе
2. Получайте баллы за покупки
3. Обменивайте баллы на напитки!

Желаем вам приятного кофе! ☕
    `.trim();

    // Отправляем без Markdown
    await ctx.reply(welcomeMessage);
    logger.info(`Start command executed for user ${ctx.from.id}`);

  } catch (error) {
    logger.error('Error in start handler:', error);
    
    // Проверяем, что ctx существует и имеет метод reply
    if (ctx && ctx.reply) {
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.')
        .catch(e => logger.error('Failed to send error message:', e));
    }
  }
}