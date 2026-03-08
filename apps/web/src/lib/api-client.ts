import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Separate client for auth routes that must use Next.js proxy to set cookies
export const authApiClient = axios.create({
  baseURL: '/api',  // Routes to Next.js API proxy
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor: Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { refreshToken } = useAuthStore.getState()

        if (!refreshToken) {
          // No refresh token, logout
          useAuthStore.getState().logout()
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          return Promise.reject(error)
        }

        // Attempt token refresh
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          { refreshToken }
        )

        const { accessToken } = response.data
        useAuthStore.getState().setAccessToken(accessToken)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout
        useAuthStore.getState().logout()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
