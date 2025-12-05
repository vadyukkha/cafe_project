import { cache } from '../utils/cache';
import { logger } from '../utils/logger';
import { User, Purchase } from '../types';

export class PointsService {
  private static readonly POINTS_PER_PURCHASE = 10;

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
    
    // Сохраняем покупку в историю
    const purchase: Purchase = {
      id: Date.now(),
      userId: user.id,
      amount: points,
      pointsEarned: points,
      description,
      createdAt: new Date()
    };
    
    const history = cache.get<Purchase[]>(`history_${telegramId}`) || [];
    history.push(purchase);
    cache.set(`history_${telegramId}`, history, 86400); // 24 часа
    
    logger.info(`Points added: ${points} to user ${telegramId} (${user.name})`);
    return user;
  }

  static async getPoints(telegramId: number): Promise<number> {
    const user = await this.getUser(telegramId);
    return user ? user.points : 0;
  }

  static async getPurchaseHistory(
    telegramId: number, 
    limit: number = 5
  ): Promise<Purchase[]> {
    const history = cache.get<Purchase[]>(`history_${telegramId}`) || [];
    return history.slice(-limit).reverse();
  }

  static async processPurchase(
    telegramId: number, 
    amount: number
  ): Promise<{ user: User; pointsEarned: number }> {
    const pointsEarned = Math.floor(amount / 100) * this.POINTS_PER_PURCHASE;
    const user = await this.addPoints(telegramId, pointsEarned, `Purchase of ${amount} RUB`);
    
    return { user, pointsEarned };
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