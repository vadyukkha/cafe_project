import { Telegraf, Context } from 'telegraf';
import { startHandler, showQrHandler, showLastPointsHandler } from './handlers';
import { PointsService } from './services/pointsService';
import { logger } from './utils/logger';

// Определяем кастомный тип контекста
interface MyContext extends Context {
  session?: {
    user?: any;
  };
}

export function createBot(token: string): Telegraf<MyContext> {
  const bot = new Telegraf<MyContext>(token);

  // Команды
  bot.start(startHandler);
  bot.command('showqr', showQrHandler);
  bot.command('showqrcode', showQrHandler);
  bot.command('showlastpoints', showLastPointsHandler);
  bot.command('history', showLastPointsHandler);
  bot.command('points', showLastPointsHandler);
  bot.command('help', async (ctx) => {
    await ctx.reply(`
Помощь по командам:

/start - Начало работы
/showQr - Получить QR-код для начисления баллов
/showLastPoints - История начислений баллов
/help - Эта справка

Как это работает:
1. Получите QR-код командой /showQr
2. Покажите его на кассе при оплате
3. Баллы начислятся автоматически
4. Следите за историей командой /showLastPoints

Поддержка:
По вопросам работы бота обращайтесь в поддержку.
    `.trim());
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

  // Обработчик текстовых сообщений
  bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    
    // Пример: админская команда для добавления баллов
    if (text.startsWith('/addpoints ') && ctx.from?.id === 123456789) { // Замените на ваш ID
      const [, userId, points] = text.split(' ');
      const pointsNum = parseInt(points, 10);
      
      if (!isNaN(pointsNum) && userId) {
        await PointsService.addPoints(parseInt(userId, 10), pointsNum, 'Админское начисление');
        await ctx.reply(`✅ Начислено ${pointsNum} баллов пользователю ${userId}`);
      }
    }
  });

  // Middleware для логирования
  bot.use(async (ctx, next) => {
    logger.info(`Update received: ${ctx.updateType} from ${ctx.from?.id}`);
    await next();
  });

  // Обработка ошибок
  bot.catch((error: any, ctx: MyContext) => {
    logger.error(`Error for ${ctx.updateType}:`, error);
    
    // Проверяем, есть ли ctx и метод reply
    if (ctx && ctx.reply) {
      ctx.reply('Произошла непредвиденная ошибка. Мы уже работаем над её устранением.')
        .catch(e => logger.error('Failed to send error message:', e));
    }
  });

  return bot;
}