import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/v1'

    // Call the AdonisJS API (requires auth token in Authorization header)
    const response = await fetch(`${backendUrl}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        error,
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Failed to resend verification' },
      { status: 500 }
    )
  }
}
