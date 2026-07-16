import { NextRequest, NextResponse } from 'next/server'
import * as storage from '@/lib/storage'
import {
  formatErrorResponse,
  formatSuccessResponse,
  safeJsonParse,
  ValidationError,
} from '@/lib/validation'
import { getAuthenticatedRobloxUser, sendRobloxPrivateMessage } from '@/lib/roblox'

function validateMessageBody(body: string) {
  const value = String(body || '').trim()
  if (!value) {
    throw new ValidationError('body', 'Isi pesan wajib diisi')
  }
  if (value.length > 1000) {
    throw new ValidationError('body', 'Isi pesan maksimal 1000 karakter')
  }
  return value
}

export async function POST(request: NextRequest) {
  try {
    const body = safeJsonParse(await request.text(), {})
    console.log('[message API] Request body:', body)
    
    const connectionId = body.connectionId || ''
    const recipientIds = Array.isArray(body.recipientIds)
      ? body.recipientIds.map((id: unknown) => String(id || '').trim()).filter(id => id && /^\d+$/.test(id))
      : []
    const messageBody = validateMessageBody(body.body)

    console.log('[message API] Parsed data:', {
      connectionId,
      recipientIds,
      messageBodyLength: messageBody.length,
    })

    if (recipientIds.length === 0) {
      throw new ValidationError('recipientIds', 'Pilih minimal satu penerima')
    }

    const connection = await storage.getConnection(connectionId)
    if (!connection) {
      console.log('[message API] Connection not found:', connectionId)
      return NextResponse.json(
        formatErrorResponse(new Error('Connection not found')),
        { status: 404 }
      )
    }
    console.log('[message API] Connection found:', {
      id: connection.id,
      name: connection.name,
      hasAuthToken: !!connection.authToken,
    })

    let authUser: { id: number; name: string; displayName?: string }
    try {
      authUser = await getAuthenticatedRobloxUser(connection.authToken)
      console.log('[message API] Auth user found:', authUser)
    } catch (authError) {
      console.error('[message API] Auth failed:', authError)
      return NextResponse.json(
        formatErrorResponse(new Error('Gagal mengautentikasi ke Roblox. Periksa auth token Anda.')),
        { status: 401 }
      )
    }

    const results: Array<{ recipientId: string; success: boolean; error?: string }> = []

    for (const recipientId of recipientIds) {
      try {
        console.log(`[message API] Sending to ${recipientId}...`)
        await sendRobloxPrivateMessage({
          authToken: connection.authToken,
          senderUserId: String(authUser.id),
          recipientId,
          subject: 'Hello', // Default subject for Roblox API
          body: messageBody,
        })

        results.push({ recipientId, success: true })
        console.log(`[message API] ✅ Success sending to ${recipientId}`)
      } catch (error) {
        console.error(`[message API] ❌ Error sending to ${recipientId}:`, error)
        results.push({
          recipientId,
          success: false,
          error: error instanceof Error ? error.message : 'Gagal mengirim pesan',
        })
      }
    }

    const failed = results.filter(item => !item.success)
    const successCount = results.length - failed.length

    if (failed.length > 0 && successCount === 0) {
      const firstError = failed[0]?.error || 'Gagal mengirim pesan'
      const match = /HTTP\s+(\d+)/i.exec(firstError)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ROBLOX_API_ERROR',
            message: firstError,
          },
          data: {
            senderUserId: authUser.id,
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
          senderUserId: authUser.id,
          results,
          successCount,
          failedCount: failed.length,
        },
        failed.length > 0
          ? `Sebagian pesan berhasil dikirim (${successCount} berhasil, ${failed.length} gagal)`
          : `${successCount} pesan berhasil dikirim`
      ),
      { status: failed.length > 0 ? 207 : 200 }
    )
  } catch (error) {
    console.error('[v0] POST /api/friends/message error:', error)

    if (error instanceof ValidationError) {
      return NextResponse.json(
        formatErrorResponse(error),
        { status: 400 }
      )
    }

    const message = error instanceof Error ? error.message : 'Gagal mengirim pesan'
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
