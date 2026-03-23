/**
 * Get cookie options based on environment
 * In development, cookies don't need secure flag (HTTP localhost)
 * In production, cookies must be secure (HTTPS)
 */
export function getCookieOptions() {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return {
    httpOnly: true,
    secure: !isDevelopment, // Only require HTTPS in production
    sameSite: 'lax' as const, // Lax is safer than strict for dev/prod compatibility
    path: '/',
  }
}

/**
 * Get refresh token cookie options (with custom path)
 */
export function getRefreshTokenCookieOptions() {
  return {
    ...getCookieOptions(),
    path: '/api/auth/refresh',
  }
}
