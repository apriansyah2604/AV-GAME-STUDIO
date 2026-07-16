import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthenticatedRobloxUser, normalizeAuthToken, sendRobloxPrivateMessage } from '@/lib/roblox'
import { getConnection } from '@/lib/storage'

const RequestSchema = z.object({
  connectionId: z.string().min(1),
  recipientId: z.coerce.number().int().positive(),
  message: z.string().min(1).max(1000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { connectionId, recipientId, message } = RequestSchema.parse(body)
    console.log('[Chat API] Request:', { connectionId, recipientId, messageLength: message.length })

    const connection = await getConnection(connectionId)
    if (!connection) throw new Error('Connection not found')

    const authToken = connection.authToken
    if (!authToken) throw new Error('No auth token')

    const user = await getAuthenticatedRobloxUser(authToken)
    console.log('[Chat API] Authenticated as:', user.name)

    // Gunakan sendRobloxPrivateMessage yang ada di lib/roblox.ts (lebih stabil)
    const result = await sendRobloxPrivateMessage({
      authToken,
      senderUserId: user.id.toString(),
      recipientId: recipientId.toString(),
      subject: 'Pesan dari sistem',
      body: message,
    })

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error: any) {
    console.error('[Chat API] Error:', error)
    return NextResponse.json({
      success: false,
      error: {
        message: error.message || 'Gagal mengirim pesan',
      },
    }, { status: 500 })
  }
}
