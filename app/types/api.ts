export interface ApiEnvelope<T> {
  data?: T
  error?: string
  message?: string
}

export interface Pagination {
  page: number
  page_size: number
  total_items: number
  total_pages: number
}

export interface PaginatedList<T> {
  items: T[]
  pagination: Pagination
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
