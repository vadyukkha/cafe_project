const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

type LogLevel = keyof typeof levels;

class Logger {
  private level: number;

  constructor(level: LogLevel = 'info') {
    this.level = levels[level] || levels.info;
  }

  private log(level: LogLevel, message: string, data?: any): void {
    if (levels[level] <= this.level) {
      const timestamp = new Date().toISOString();
      const logData = data ? ` ${JSON.stringify(data)}` : '';
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}${logData}`);
    }
  }

  error(message: string, error?: any): void {
    this.log('error', message, error);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }
}

export const logger = new Logger(LOG_LEVEL as LogLevel);