import dotenv from 'dotenv';
import { createBot } from './bot';
import { logger } from './utils/logger';

// Загружаем переменные окружения
dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  logger.error('BOT_TOKEN is not defined in .env file');
  process.exit(1);
}

async function main() {
  try {
    logger.info('Starting Telegram bot...');
    if (BOT_TOKEN) {
        const bot = createBot(BOT_TOKEN);

        // Запуск бота
        await bot.launch();

        logger.info('🤖 Telegram bot started successfully!');

        // Graceful shutdown
        const shutdown = (signal: string) => {
            logger.info(`Received ${signal}, shutting down...`);
            bot.stop(signal);
            process.exit(0);
        };

        process.once('SIGINT', () => shutdown('SIGINT'));
        process.once('SIGTERM', () => shutdown('SIGTERM'));
    }
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

// Запуск приложения
main();