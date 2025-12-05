import { cache } from '../utils/cache';
import { logger } from '../utils/logger';
import { User, Purchase } from '../types';

export class PointsService {
  private static readonly POINTS_PER_PURCHASE = 10;

  static async getUser(telegramId: number): Promise<User> {
    const user = cache.get<User>(`user_${telegramId}`);
    
    if (!user) {
      const newUser: User = {
        id: Date.now(),
        telegramId,
        name: `User_${telegramId}`,
        points: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      cache.set(`user_${telegramId}`, newUser);
      logger.info(`New user created: ${telegramId}`);
      return newUser;
    }
    
    return user;
  }

  static async addPoints(telegramId: number, points: number, description?: string): Promise<User> {
    const user = await this.getUser(telegramId);
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
    
    logger.info(`Points added: ${points} to user ${telegramId}`);
    return user;
  }

  static async getPoints(telegramId: number): Promise<number> {
    const user = await this.getUser(telegramId);
    return user.points;
  }

  static async getPurchaseHistory(telegramId: number, limit: number = 5): Promise<Purchase[]> {
    const history = cache.get<Purchase[]>(`history_${telegramId}`) || [];
    return history.slice(-limit).reverse();
  }

  static async processPurchase(telegramId: number, amount: number): Promise<{ user: User; pointsEarned: number }> {
    const pointsEarned = Math.floor(amount / 100) * this.POINTS_PER_PURCHASE;
    const user = await this.addPoints(telegramId, pointsEarned, `Purchase of ${amount} RUB`);
    
    return { user, pointsEarned };
  }
}