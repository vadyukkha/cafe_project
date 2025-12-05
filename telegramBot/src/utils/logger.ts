const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
} as const;

type LogLevel = keyof typeof levels;

export class Logger {
  private level: number;

  constructor(level: LogLevel = 'info') {
    this.level = levels[level] || levels.info;
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    if (levels[level] <= this.level) {
      const timestamp = new Date().toISOString();
      const logData = data ? ` ${JSON.stringify(data, null, 2)}` : '';
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}${logData}`);
    }
  }

  error(message: string, error?: unknown): void {
    this.log('error', message, error);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }
}

export const logger = new Logger((LOG_LEVEL as LogLevel));