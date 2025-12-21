import apiConfig from '../config/config';
import { CardResponse, PostPutResponse } from '../types/api';

/**
 * GET /api/v1/telegram/card?telegramId=...
 * Получить карту по telegramId
 */
export async function getLoyaltyCard(telegramId: string) {
    try {
        const res = await fetch(`${apiConfig.baseUrl}/telegram/card?telegramId=${telegramId}`, {
            method: 'GET',
        });
        const data: CardResponse = await res.json() as CardResponse;
        if (!res.ok) {
            throw new Error(data.message! || "Error pizdec");
        }
        return { success: res.ok, data };
    } catch {
        return { success: false, message: 'Ошибка сервера' }
    }
}

/**
 * POST /api/v1/telegram/card
 * Создать карту с userId = null
 */
export async function createLoyaltyCard(telegramId: string) {
    try {
        const res = await fetch(`${apiConfig.baseUrl}/telegram/card`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ telegramId }),
        });
        const data: PostPutResponse = await res.json() as PostPutResponse;
        if (!res.ok) {
            throw new Error(data.message! || "Error pizdec");
        }
        return { success: res.ok, message: data.message };
    } catch {
        return { success: false, message: 'Ошибка сервера' }
    }
}

/**
 * PUT /api/v1/telegram/card
 * Привязать карту к userId (через заголовок x-user-id)
 */
export async function attachLoyaltyCardToUser(params: {
    telegramId: string;
    userId: string;
}) {
    try {
        const res = await fetch(`${apiConfig.baseUrl}/telegram/card`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ telegramId: params.telegramId, userId: params.userId }),
        });

        const data: PostPutResponse = await res.json() as PostPutResponse;
        if (!res.ok) {
            throw new Error(data.message! || "Error pizdec");
        }
        return { success: res.ok, message: data.message };
    } catch {
        return { success: false, message: 'Ошибка сервера' }
    }
}
