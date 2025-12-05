export interface User {
  id: number;
  telegramId: number;
  name: string;
  phone?: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Purchase {
  id: number;
  userId: number;
  amount: number;
  pointsEarned: number;
  description?: string;
  createdAt: Date;
}

export interface BotContext {
  user?: User;
  session?: any;
}

export interface QrCodeData {
  userId: number;
  points: number;
  action: 'add_points' | 'redeem' | 'check';
  timestamp: number;
  signature?: string;
}