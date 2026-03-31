import { authApiClient } from '@/lib/api-client'
import { useAuthStore } from '@/stores/auth-store'
import type {
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  AuthResponse,
} from '@focus-guide/shared'

class AuthService {
  /**
   * Register a new user account
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await authApiClient.post<RegisterResponse>('/auth/register', data)
    return response.data
  }

  /**
   * Login with email and password
   * Uses apiClient for consistent error handling and interceptors
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await authApiClient.post<AuthResponse>('/auth/login', data)
      const authData = response.data

      // Store auth data in Zustand
      const { user, accessToken, refreshToken } = authData
      useAuthStore.getState().setAuth(user, accessToken, refreshToken)

      return authData
    } catch (error) {
      throw error
    }
  }

  /**
   * Logout and clear auth state
   * Uses authApiClient for consistent error handling and cookie clearing
   */
  async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate tokens server-side
      await authApiClient.post('/auth/logout')
    } catch (error) {
      // Don't throw - logout should always clear local state even if API call fails
    } finally {
      // Clear auth state even if API call fails
      useAuthStore.getState().logout()
    }
  }

  /**
   * Refresh the access token using refresh token
   */
  async refreshToken(): Promise<string> {
    const { refreshToken } = useAuthStore.getState()

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await authApiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    })
    const { accessToken } = response.data

    useAuthStore.getState().setAccessToken(accessToken)

    return accessToken
  }

  /**
   * Verify email with verification token
   */
  async verifyEmail(token: string): Promise<void> {
    await authApiClient.post('/auth/verify-email', { token })
  }

  /**
   * Request email verification link to be resent
   */
  async resendVerification(): Promise<void> {
    await authApiClient.post('/auth/resend-verification')
  }
}

export const authService = new AuthService()
