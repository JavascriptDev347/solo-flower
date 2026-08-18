export type UserRole = 'admin' | 'customer'

export interface RegisterPayload {
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterResponse {
  user_id: string
  email: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface MeResponse {
  user_id: string
  email: string
  role: UserRole
}
