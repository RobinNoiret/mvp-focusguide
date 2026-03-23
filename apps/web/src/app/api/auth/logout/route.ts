import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth_token')?.value
    const backendUrl = process.env.API_URL || 'http://localhost:3333/v1'

    if (authToken) {
      // Call the AdonisJS logout endpoint
      await fetch(`${backendUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }).catch(() => {
        // Ignore errors - we'll clear the cookie anyway
      })
    }

    // Create response and clear auth cookies
    const res = NextResponse.json({ success: true })
    res.cookies.delete('auth_token')
    res.cookies.delete('refresh_token')

    return res
  } catch {
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
