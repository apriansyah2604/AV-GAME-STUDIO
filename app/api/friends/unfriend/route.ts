import { NextRequest, NextResponse } from 'next/server'
import * as storage from '@/lib/storage'
import { validators, formatErrorResponse, formatSuccessResponse, safeJsonParse, ValidationError, AppError } from '@/lib/validation'
import { unfriendRobloxUser } from '@/lib/roblox'

export async function POST(request: NextRequest) {
  try {
    const body = safeJsonParse(await request.text(), {})
    const connectionId = validators.connectionId(body.connectionId || '')
    const targetUserIds = Array.isArray(body.targetUserIds)
      ? body.targetUserIds.map((id: unknown) => validators.robloxUserId(String(id)))
      : [validators.robloxUserId(String(body.targetUserId || ''))]

    const connection = storage.getConnection(connectionId)
    if (!connection) {
      return NextResponse.json(
        formatErrorResponse(new Error('Connection not found')),
        { status: 404 }
      )
    }

    const results: Array<{ targetUserId: string; success: boolean; error?: string }> = []

    for (const targetUserId of targetUserIds) {
      try {
        await unfriendRobloxUser({ authToken: connection.authToken, targetUserId })
        results.push({ targetUserId, success: true })
      } catch (error) {
        results.push({
          targetUserId,
          success: false,
          error: error instanceof Error ? error.message : 'Gagal menghapus pertemanan',
        })
      }
    }

    const failed = results.filter(item => !item.success)
    const successCount = results.length - failed.length

    if (failed.length > 0 && successCount === 0) {
      const firstError = failed[0]?.error || 'Gagal menghapus pertemanan'
      const match = /HTTP\s+(\d+)/i.exec(firstError)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ROBLOX_API_ERROR',
            message: firstError,
          },
          data: {
            results,
            successCount,
            failedCount: failed.length,
          },
        },
        { status: match ? Number(match[1]) : 500 }
      )
    }

    return NextResponse.json(
      formatSuccessResponse(
        {
          results,
          successCount,
          failedCount: failed.length,
        },
        failed.length > 0
          ? `Sebagian pertemanan berhasil dihapus (${successCount} berhasil, ${failed.length} gagal)`
          : targetUserIds.length > 1
            ? `${successCount} pertemanan berhasil dihapus`
            : 'Unfriended successfully'
      ),
      { status: failed.length > 0 ? 207 : 200 }
    )
  } catch (error) {
    console.error('[v0] POST /api/friends/unfriend error:', error)

    if (error instanceof ValidationError || error instanceof AppError) {
      return NextResponse.json(
        formatErrorResponse(error),
        { status: error instanceof AppError ? error.statusCode : 400 }
      )
    }

    const message = error instanceof Error ? error.message : 'Gagal menghapus pertemanan'
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
