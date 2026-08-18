export interface ApiEnvelope<T> {
  data?: T
  error?: string
  message?: string
}

// Backend status kodlariga mos xatolik turlari
export type ApiErrorStatus = 400 | 401 | 403 | 404 | 409 | 500

export class ApiError extends Error {
  status: number
  serverMessage?: string

  constructor(status: number, message: string, serverMessage?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.serverMessage = serverMessage
  }
}
