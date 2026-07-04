import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthenticatedRobloxUser, normalizeAuthToken } from '@/lib/roblox'
import { getConnection } from '@/lib/storage'

const RequestSchema = z.object({
  connectionId: z.string().min(1),
  recipientId: z.coerce.number().int().positive(),
  message: z.string().min(1).max(1000),
})

function getSecurityCookie(authToken: string) {
  return `.ROBLOSECURITY=${normalizeAuthToken(authToken)}`
}

async function fetchCsrfToken(authToken: string) {
  const res = await fetch('https://auth.roblox.com/v2/logout', {
    method: 'POST',
    headers: {
      'Cookie': getSecurityCookie(authToken),
      'Origin': 'https://www.roblox.com',
      'Referer': 'https://www.roblox.com/',
    },
  })
  const token = res.headers.get('x-csrf-token')
  if (!token) throw new Error('No CSRF token')
  return token
}

async function startOneToOneConversation(authToken: string, targetUserId: number, csrfToken: string) {
  console.log('[Chat v2] Starting conversation with:', targetUserId)
  const url = 'https://chat.roblox.com/v2/start-one-to-one-conversation'
  
  const attempt = async (token: string) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Cookie': getSecurityCookie(authToken),
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
        'Origin': 'https://www.roblox.com',
        'Referer': 'https://www.roblox.com/',
      },
      body: JSON.stringify({ participantUserId: targetUserId }),
    })
  }

  let res = await attempt(csrfToken)
  if (res.status === 403) {
    const refreshed = res.headers.get('x-csrf-token')
    if (refreshed) {
      res = await attempt(refreshed)
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('[Chat v2] Failed to start conversation:', res.status, text)
    throw new Error(`Failed to start conversation: ${res.status}`)
  }

  const data = await res.json()
  console.log('[Chat v2] Conversation started:', data)
  return data.conversationId
}

async function sendMessageToConversation(authToken: string, conversationId: string, message: string, csrfToken: string) {
  console.log('[Chat v2] Sending message to conversation:', conversationId)
  const url = 'https://chat.roblox.com/v2/send-message'
  
  const attempt = async (token: string) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Cookie': getSecurityCookie(authToken),
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
        'Origin': 'https://www.roblox.com',
        'Referer': 'https://www.roblox.com/',
      },
      body: JSON.stringify({
        conversationId,
        message,
      }),
    })
  }

  let res = await attempt(csrfToken)
  if (res.status === 403) {
    const refreshed = res.headers.get('x-csrf-token')
    if (refreshed) {
      res = await attempt(refreshed)
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    console.error('[Chat v2] Failed to send message:', res.status, text)
    throw new Error(`Failed to send message: ${res.status}`)
  }

  const data = await res.json()
  console.log('[Chat v2] Message sent:', data)
  return data
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { connectionId, recipientId, message } = RequestSchema.parse(body)
    console.log('[Chat API] Request:', { connectionId, recipientId, messageLength: message.length })

    const connection = getConnection(connectionId)
    if (!connection) throw new Error('Connection not found')

    const authToken = connection.authToken
    if (!authToken) throw new Error('No auth token')

    const user = await getAuthenticatedRobloxUser(authToken)
    console.log('[Chat API] Authenticated as:', user.name)

    const csrfToken = await fetchCsrfToken(authToken)
    console.log('[Chat API] CSRF token ready')

    let conversationId: string
    try {
      conversationId = await startOneToOneConversation(authToken, recipientId, csrfToken)
    } catch (e) {
      console.warn('[Chat API] Could not start conversation, maybe already exists:', e)
      throw new Error('Tidak dapat memulai percakapan. Pastikan Anda berteman dengan pengguna tersebut.')
    }

    const result = await sendMessageToConversation(authToken, conversationId, message, csrfToken)
    
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
