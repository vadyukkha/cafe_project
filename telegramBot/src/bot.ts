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

  // Регистрируем команды с разными вариантами написания
  bot.start(startHandler);
  
  // Команда showQr с разными вариантами
  bot.command('showqr', showQrHandler);
  bot.command('showQr', showQrHandler);
  bot.command('showqr@coffee_shop_bot', showQrHandler); // если используется в группе
  
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

  // Обработчики callback-кнопок
  bot.action('refresh_qr', async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await showQrHandler(ctx);
    } catch (error) {
      logger.error('Error in refresh_qr action:', error);
    }
  });

  bot.action('get_qr', async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await showQrHandler(ctx);
    } catch (error) {
      logger.error('Error in get_qr action:', error);
    }
  });

  bot.action('show_points', async (ctx) => {
    try {
      await ctx.answerCbQuery();
      if (ctx.from) {
        // Имитация получения баллов
        ctx.reply('Ваш баланс: 0 ⭐\n\nИспользуйте /showQr чтобы получить QR-код и начать накапливать баллы!');
      }
    } catch (error) {
      logger.error('Error in show_points action:', error);
    }
  });

  bot.action('refresh_history', async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await showLastPointsHandler(ctx);
    } catch (error) {
      logger.error('Error in refresh_history action:', error);
    }
  });

  // Обработчик ошибок
  bot.catch((error: any, ctx) => {
    logger.error(`Error for ${ctx.updateType}:`, error);
    
    try {
      if (ctx.reply) {
        ctx.reply('Произошла ошибка. Пожалуйста, попробуйте позже.');
      }
    } catch (e) {
      logger.error('Failed to send error message:', e);
    }
  });

  return bot;
}