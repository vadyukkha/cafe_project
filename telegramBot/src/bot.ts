import { Telegraf } from 'telegraf';
import { logger } from './utils/logger';
import { startHandler } from './handlers/start';
import { showQrHandler } from './handlers/showQr';
import { showLastPointsHandler } from './handlers/showLastPoints';

export function createBot(token: string) {
  const bot = new Telegraf(token);

  // Логируем все входящие сообщения
  bot.use(async (ctx, next) => {
    logger.info(`Update type: ${ctx.updateType}`);
    
    if (ctx.message && ctx.updateType === 'message' && 'text' in ctx.message) {
      logger.info(`Message from ${ctx.from?.id}: ${ctx.message.text}`);
    }
    
    await next();
  });

  // Регистрируем команды
  bot.start(startHandler);
  
  // Команда showQr с разными вариантами
  bot.command('showqr', showQrHandler);
  bot.command('showQr', showQrHandler);
  
  // Команда showLastPoints с разными вариантами
  bot.command('showlastpoints', showLastPointsHandler);
  bot.command('showLastPoints', showLastPointsHandler);
  bot.command('history', showLastPointsHandler);
  bot.command('points', showLastPointsHandler);

  // Простая команда help
  bot.command('help', (ctx) => {
    ctx.reply(
      'Доступные команды:\n' +
      '/start - Начало работы\n' +
      '/showQr - Получить QR-код\n' +
      '/showLastPoints - История баллов\n' +
      '/help - Помощь'
    );
  });

  // ... остальной код обработчиков callback-кнопок и ошибок

  return bot;
}