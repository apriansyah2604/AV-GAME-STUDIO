import { NextRequest, NextResponse } from 'next/server'
import * as storage from '@/lib/storage'
import { validators, formatErrorResponse, formatSuccessResponse, ValidationError, AppError } from '@/lib/validation'
import { listRobloxFriends } from '@/lib/roblox'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const connectionId = validators.connectionId(searchParams.get('connectionId') || '')
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? Number(limitParam) : 1000

    const connection = storage.getConnection(connectionId)
    if (!connection) {
      return NextResponse.json(
        formatErrorResponse(new Error('Connection not found')),
        { status: 404 }
      )
    }

    const friends = await listRobloxFriends({
      robloxUserId: connection.robloxUserId,
      authToken: connection.authToken,
      limit: Number.isFinite(limit) ? limit : 1000,
    })

    return NextResponse.json(
      formatSuccessResponse(friends, 'Friends fetched successfully'),
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] GET /api/friends error:', error)

    if (error instanceof ValidationError || error instanceof AppError) {
      return NextResponse.json(
        formatErrorResponse(error),
        { status: error instanceof AppError ? error.statusCode : 400 }
      )
    }

    const message = error instanceof Error ? error.message : 'Gagal mengambil daftar teman'
    const match = /HTTP\s+(\d+)/i.exec(message)
    const status = match ? Number(match[1]) : 500

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'ROBLOX_API_ERROR',
          message,
        },
      },
      { status }
    )
  }
}
