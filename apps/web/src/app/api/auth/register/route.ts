import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/v1'

    // Call the AdonisJS API
    const response = await fetch(`${backendUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        error,
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}
