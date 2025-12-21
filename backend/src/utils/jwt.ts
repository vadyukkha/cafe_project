import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { JwtPayload } from '@/src/types/token';

export function generateRandomSession() {
	return crypto.randomBytes(32).toString('hex');
}

export function hashSession(session: string) {
	return crypto
		.createHash('sha256')
		.update(session + process.env.JWT_SECRET!)
		.digest('hex');
}

export function signJwt(payload: JwtPayload) {
	return jwt.sign(
		payload,
		process.env.JWT_SECRET!,
		{ expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }
	);
}

export function verifyJwt(token: string): JwtPayload | null {
	try {
		return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
	} catch {
		return null;
	}
}
