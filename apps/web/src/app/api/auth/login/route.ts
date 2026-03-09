import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const backendUrl = process.env.API_URL || 'http://localhost:3333/v1'

    // Call the AdonisJS API
    const response = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const { accessToken, refreshToken } = data

    // Create response with cookies set server-side
    const res = NextResponse.json(data)

    // Set access token cookie (short-lived, httpOnly for security)
    res.cookies.set('auth_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes, matches access token lifetime
      path: '/',
    })

    // Set refresh token cookie (long-lived, httpOnly for security)
    res.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/api/auth/refresh',
    })

    return res
  } catch {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
