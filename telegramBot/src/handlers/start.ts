import { Context } from 'telegraf';
import { PointsService } from '../services/pointsService';
import { logger } from '../utils/logger';

export async function startHandler(ctx: Context): Promise<void> {
  try {
    if (!ctx.from) {
      logger.warn('Start command called without user info');
      return;
    }

    // Проверяем, что message существует и имеет свойство text
    let payload = '';
    if (ctx.message && 'text' in ctx.message) {
      // Получаем параметр из deep link (t.me/bot?start=параметр)
      const parts = ctx.message.text.split(' ');
      if (parts.length > 1) {
        payload = parts[1];
      }
    }
    
    logger.info(`Start command from user ${ctx.from.id} with payload: ${payload}`);

    const user = await PointsService.getUser(ctx.from.id);
    const points = await PointsService.getPoints(ctx.from.id);

    // Используем имя из Telegram или дефолтное
    const userName = ctx.from.first_name || ctx.from.username || user.name;

    let welcomeMessage = `☕ Добро пожаловать в нашу кофейню!\n\nПривет, ${userName}! Рады видеть вас в нашем приложении.\n\n`;

    // Если есть параметр, обрабатываем его
    if (payload) {
      // await handleStartPayload(ctx.from.id, payload);
      welcomeMessage += `🔗 Вы перешли по специальной ссылке с параметром: ${payload}\n\n`;
    }

    welcomeMessage += `Ваши текущие баллы: ${points} ⭐\n\nДоступные команды:\n/showQr - Получить QR-код для начисления баллов\n/showLastPoints - История начислений\n/help - Помощь по командам\n\nКак это работает:\n1. Покажите QR-код на кассе\n2. Получайте баллы за покупки\n3. Обменивайте баллы на напитки!\n\nЖелаем вам приятного кофе! ☕`;

    await ctx.reply(welcomeMessage);
    logger.info(`Start command executed for user ${ctx.from.id}`);

  } catch (error) {
    logger.error('Error in start handler:', error);
    
    if (ctx && ctx.reply) {
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.')
        .catch(e => logger.error('Failed to send error message:', e));
    }
  }
}

// Функция обработки параметров из deep link
async function handleStartPayload(userId: number, payload: string): Promise<void> {
  try {
    logger.info(`Processing start payload for user ${userId}: ${payload}`);
    // Обработка числового ID
    await handleUserIdParam(userId, payload);
  } catch (error) {
    logger.error('Error handling start payload:', error);
  }
}

async function handleUserIdParam(userId: number, param: string): Promise<void> {
  logger.info(`User ${userId} started with user ID param: ${param}`);
  
  // Можно сохранить связь между пользователями
  // или выполнить другую логику
}
