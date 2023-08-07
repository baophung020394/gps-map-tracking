export interface UserParams {
  id?: string
  atk?: string
  email: string
  role: string
  isAuthenticated: boolean
  username: string
}

export interface LoginResponse {
  params?: UserParams
  ptCommand: number
  ptGroup: number
  result: string
  token: string
}
