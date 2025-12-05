import { Telegraf } from 'telegraf';
import { logger } from './utils/logger';
import { startHandler } from './handlers/start';
import { showQrHandler } from './handlers/showQr';
import { showLastPointsHandler } from './handlers/showLastPoints';
import { PointsService } from './services/pointsService';

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

  // Обработчики callback-кнопок
  bot.action('refresh_qr', async (ctx) => {
    await ctx.answerCbQuery('Обновляем QR-код...');
    await showQrHandler(ctx);
  });

  bot.action('get_qr', async (ctx) => {
    await ctx.answerCbQuery();
    await showQrHandler(ctx);
  });

  bot.action('show_points', async (ctx) => {
    if (!ctx.from) return;
    await ctx.answerCbQuery();
    const points = await PointsService.getPoints(ctx.from.id);
    await ctx.reply(`Ваш баланс: ${points} ⭐`);
  });

  bot.action('refresh_history', async (ctx) => {
    await ctx.answerCbQuery('Обновляем историю...');
    await showLastPointsHandler(ctx);
  });

  return bot;
}