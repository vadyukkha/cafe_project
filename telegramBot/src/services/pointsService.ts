import { cache } from '../utils/cache';
import { logger } from '../utils/logger';
import { User } from '../types';

export class PointsService {
  // Метод для получения или создания пользователя
  static async getOrCreateUser(
    telegramId: number, 
    name?: string
  ): Promise<User> {
    // Пытаемся получить существующего пользователя
    const existingUser = cache.get<User>(`user_${telegramId}`);
    
    if (existingUser) {
      // Если передано новое имя, обновляем его
      if (name && existingUser.name !== name) {
        existingUser.name = name;
        existingUser.updatedAt = new Date();
        cache.set(`user_${telegramId}`, existingUser);
        logger.info(`User ${telegramId} name updated to: ${name}`);
      }
      return existingUser;
    }
    
    // Создаем нового пользователя
    const newUser: User = {
      id: Date.now(),
      telegramId,
      name: name || `User_${telegramId}`,
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    cache.set(`user_${telegramId}`, newUser);
    logger.info(`New user created: ${telegramId}, name: ${newUser.name}`);
    return newUser;
  }

  // Метод только для получения пользователя (без создания)
  static async getUser(telegramId: number): Promise<User | null> {
    const user = cache.get<User>(`user_${telegramId}`);
    return user || null;
  }

  static async addPoints(
    telegramId: number, 
    points: number, 
    description?: string
  ): Promise<User> {
    // Получаем пользователя, если его нет - создаем с дефолтным именем
    let user = await this.getUser(telegramId);
    if (!user) {
      user = await this.getOrCreateUser(telegramId);
    }
    
    user.points += points;
    user.updatedAt = new Date();
    
    cache.set(`user_${telegramId}`, user);
    
    logger.info(`Points added: ${points} to user ${telegramId} (${user.name})`);
    return user;
  }

  static async getPoints(telegramId: number): Promise<number> {
    const user = await this.getUser(telegramId);
    return user ? user.points : 0;
  }

  // Метод для обновления данных пользователя
  static async updateUser(
    telegramId: number, 
    updates: Partial<User>
  ): Promise<User | null> {
    const user = await this.getUser(telegramId);
    
    if (!user) {
      return null;
    }
    
    // Обновляем только переданные поля
    Object.assign(user, updates);
    user.updatedAt = new Date();
    
    cache.set(`user_${telegramId}`, user);
    logger.info(`User ${telegramId} updated`);
    
    return user;
  }
}