import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const backendUrl = process.env.API_URL || 'http://localhost:3333/v1'
    const authHeader = request.headers.get('Authorization') || ''

    const response = await fetch(`${backendUrl}/users/me/pomodoro-settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update pomodoro settings' },
      { status: 500 }
    )
  }
}
