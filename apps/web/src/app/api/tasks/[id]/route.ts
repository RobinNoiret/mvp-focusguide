import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const backendUrl = process.env.API_URL || 'http://localhost:3333/v1'
    const authHeader = request.headers.get('Authorization') || ''

    const response = await fetch(`${backendUrl}/tasks/${params.id}`, {
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
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const backendUrl = process.env.API_URL || 'http://localhost:3333/v1'
    const authHeader = request.headers.get('Authorization') || ''

    console.log('[NEXT DELETE] Fetching:', `${backendUrl}/tasks/${params.id}`)

    const response = await fetch(`${backendUrl}/tasks/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
    })

    console.log('[NEXT DELETE] Response status:', response.status)
    console.log('[NEXT DELETE] Response ok:', response.ok)

    if (!response.ok) {
      console.log('[NEXT DELETE] Response not ok, reading error')
      let error: unknown
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        error = await response.json()
      } else {
        error = { message: `HTTP ${response.status}` }
      }
      return NextResponse.json(error, { status: response.status })
    }

    // 204 No Content has no body - cannot use .json() with 204
    if (response.status === 204) {
      console.log('[NEXT DELETE] Returning 204')
      return new NextResponse(null, { status: 204 })
    }

    console.log('[NEXT DELETE] Parsing JSON response')
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[NEXT DELETE ERROR]', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
