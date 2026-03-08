import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token required' },
        { status: 400 }
      )
    }

    // Call the AdonisJS refresh endpoint
    const response = await fetch('http://localhost:3333/v1/auth/refresh', {
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
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes, matches access token lifetime
      path: '/',
    })

    // Update refresh token cookie if provided
    if (newRefreshToken) {
      res.cookies.set('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/api/auth/refresh',
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
