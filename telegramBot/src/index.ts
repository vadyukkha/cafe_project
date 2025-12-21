import dotenv from 'dotenv';
import { createBot } from './bot';
import { logger } from './utils/logger';

// Загружаем переменные окружения
dotenv.config();

// Получаем токен
const BOT_TOKEN = process.env.BOT_TOKEN;

// Проверяем наличие токена
if (!BOT_TOKEN) {
    logger.error('❌ BOT_TOKEN не найден в .env файле');
    console.error('Пожалуйста, создайте файл .env и добавьте BOT_TOKEN=ваш_токен');
    process.exit(1);
}

// Приводим тип к string, так как мы уже проверили, что он не undefined
const token: string = BOT_TOKEN;

async function main() {
    try {
        logger.info('🚀 Запуск Telegram бота...');

        const bot = createBot(token);

        // Запускаем бота с опциями
        await bot.launch({
            dropPendingUpdates: true, // Игнорируем старые сообщения при перезапуске
        });

        logger.info('✅ Бот успешно запущен!');
        logger.info('📋 Команды бота:');
        logger.info('   /start - Начало работы');
        logger.info('   /showQr или /showqr - Получить QR-код');
        logger.info('   /showLastPoints или /showlastpoints - История баллов');
        logger.info('   /help - Помощь');

        // Graceful shutdown
        process.once('SIGINT', () => {
            logger.info('🛑 Получен SIGINT, выключаем бота...');
            bot.stop('SIGINT');
        });

        process.once('SIGTERM', () => {
            logger.info('🛑 Получен SIGTERM, выключаем бота...');
            bot.stop('SIGTERM');
        });

    } catch (error) {
        logger.error('❌ Ошибка при запуске бота:', error);
        process.exit(1);
    }
}

// Запускаем приложение
main().catch(error => {
    logger.error('Необработанная ошибка:', error);
    process.exit(1);
});