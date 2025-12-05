import QRCode from 'qrcode';
import { QrCodeData } from '../types';
import { logger } from '../utils/logger';

export class QrService {
  static async generateQrCode(data: QrCodeData): Promise<string> {
    try {
      const jsonData = JSON.stringify(data);
      const qrCode = await QRCode.toDataURL(jsonData, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 400
      });
      
      logger.info(`QR code generated for user ${data.userId}`);
      return qrCode;
    } catch (error) {
      logger.error('Failed to generate QR code:', error);
      throw new Error('QR generation failed');
    }
  }

  static async generateUserQr(userId: number, points: number): Promise<string> {
    const qrData: QrCodeData = {
      userId,
      points,
      action: 'add_points',
      timestamp: Date.now()
    };

    return this.generateQrCode(qrData);
  }

  static parseQrCode(data: string): QrCodeData | null {
    try {
      return JSON.parse(data) as QrCodeData;
    } catch (error) {
      logger.error('Failed to parse QR code data:', error);
      return null;
    }
  }
}