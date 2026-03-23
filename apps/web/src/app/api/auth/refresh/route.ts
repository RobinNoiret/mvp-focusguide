import { NextRequest, NextResponse } from 'next/server'
import { getCookieOptions, getRefreshTokenCookieOptions } from '@/lib/cookie-utils'

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token required' },
        { status: 400 }
      )
    }

    const backendUrl = process.env.API_URL || 'http://localhost:3333/v1'

    // Call the AdonisJS refresh endpoint
    const response = await fetch(`${backendUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )
    }

    const data = await response.json()
    const { accessToken, refreshToken: newRefreshToken } = data

    // Create response with updated cookies
    const res = NextResponse.json(data)

    // Update access token cookie (short-lived, httpOnly for security)
    res.cookies.set('auth_token', accessToken, {
      ...getCookieOptions(),
      maxAge: 15 * 60, // 15 minutes, matches access token lifetime
    })

    // Update refresh token cookie if provided
    if (newRefreshToken) {
      res.cookies.set('refresh_token', newRefreshToken, {
        ...getRefreshTokenCookieOptions(),
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })
    }

    return res
  } catch {
    return NextResponse.json(
      { error: 'Refresh failed' },
      { status: 500 }
    )
  }
}
