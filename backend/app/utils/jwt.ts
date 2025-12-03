import {JwtPayload} from '@/app/types/token'
import jwt from 'jsonwebtoken'

export function signJwt(payload: JwtPayload) {
  return jwt.sign(
      payload, process.env.JWT_SECRET!,
      {expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']})
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
  } catch (e) {
    return null
  }
}
