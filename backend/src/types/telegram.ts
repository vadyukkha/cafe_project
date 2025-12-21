export interface CreateCardRequest {
	telegramId: string;
}

export interface UpdateCardRequest {
	telegramId: string;
	userId?: string;
	amount?: number;
}

export interface CardResponse {
	id: string;
	telegramId: string;
	userId: string | null;
	amount: number;
	user?: {
		id: string;
		email: string;
		name: string;
	};
}
