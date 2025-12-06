import { Context } from 'telegraf';
import { PointsService } from '../services/pointsService';
import { logger } from '../utils/logger';

export async function startHandler(ctx: Context): Promise<void> {
  try {
    if (!ctx.from) {
      logger.warn('Start command called without user info');
      return;
    }

    // Получаем имя пользователя из Telegram
    const userName = getUserNameFromContext(ctx);
    
    // Получаем или создаем пользователя с реальным именем
    const user = await PointsService.getOrCreateUser(ctx.from.id, userName);
    const points = await PointsService.getPoints(ctx.from.id);

    // Получаем параметр из deep link (t.me/bot?start=параметр)
    let payload = '';
    if (ctx.message && 'text' in ctx.message) {
      const parts = ctx.message.text.split(' ');
      if (parts.length > 1) {
        payload = parts[1];
      }
    }
    
    logger.info(`Start command from user ${ctx.from.id} (${userName}) with payload: ${payload}`);

    let welcomeMessage = `☕ Добро пожаловать в нашу кофейню!\n\nПривет, ${userName}! Рады видеть вас в нашем приложении.\n\n`;

    // Если есть параметр, обрабатываем его
    if (payload) {
      // Здесь можно добавить обработку payload
      welcomeMessage += `🔗 Вы перешли по специальной ссылке с параметром: ${payload}\n\n`;
    }

    welcomeMessage += `Ваши текущие баллы: ${points} ⭐\n\nДоступные команды:\n/showQr - Получить QR-код для начисления баллов\n/showLastPoints - История начислений\n/help - Помощь по командам\n\nКак это работает:\n1. Покажите QR-код на кассе\n2. Получайте баллы за покупки\n3. Обменивайте баллы на напитки!\n\nЖелаем вам приятного кофе! ☕`;

    await ctx.reply(welcomeMessage);
    logger.info(`Start command executed for user ${ctx.from.id} (${userName})`);

  } catch (error) {
    logger.error('Error in start handler:', error);
    
    if (ctx && ctx.reply) {
      await ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.')
        .catch(e => logger.error('Failed to send error message:', e));
    }
  }
}

// Функция для получения имени пользователя из контекста
function getUserNameFromContext(ctx: Context): string {
  if (!ctx.from) {
    return 'Гость';
  }
  
  const { first_name, last_name, username } = ctx.from;
  
  // Формируем имя в порядке приоритета:
  // 1. Имя и фамилия
  // 2. Только имя
  // 3. Username
  // 4. ID пользователя
  
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