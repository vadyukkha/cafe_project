import { Role } from "../enums/role"

export type JwtPayload = {
	id: string
	email: string
	role: Role.USER | Role.ADMIN
	iat?: number
	exp?: number
}
