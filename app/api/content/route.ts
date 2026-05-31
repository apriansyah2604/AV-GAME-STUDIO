import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const noStoreHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
}

function jsonNoStore(body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      ...noStoreHeaders,
      ...(init?.headers || {}),
    },
  })
}

function sanitizeRows(rows: any[]) {
  return rows.map(({ id, created_at, ...row }) => row)
}

async function fetchContentTable(table: string, ascending = true) {
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending })
  if (error) {
    console.warn(`[GET /api/content] Failed to fetch ${table}:`, error.message)
    return []
  }

  return data || []
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  try {
    if (type === 'gallery') {
      return jsonNoStore(await fetchContentTable('gallery', false))
    }
    
    // Fetch all content
    const [pricing, assets] = await Promise.all([
      fetchContentTable('pricing', true),
      fetchContentTable('assets', true),
    ])

    return jsonNoStore({
      robux_packages: pricing || [],
      avatar_services: assets || [],
      general: {}
    })
  } catch (error: any) {
    console.error('Supabase Fetch Content Error:', error)
    return jsonNoStore({
      robux_packages: [],
      avatar_services: [],
      general: {}
    }, { status: 200 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const type = payload?.type
    const newData = payload?.data

    // Lightweight logging to help debugging in deployment logs
    try {
      const preview = Array.isArray(newData) ? `array(${newData.length})` : typeof newData
      console.log(`[POST /api/content] type=${type} data=${preview}`)
    } catch (logErr) {
      console.warn('Failed to log payload preview', logErr)
    }

    // Protect against accidentally huge payloads
    if (Array.isArray(newData) && newData.length > 500) {
      return jsonNoStore({ error: 'Payload too large: data array exceeds 500 items' }, { status: 413 })
    }

    if (!type || typeof type !== 'string') {
      return jsonNoStore({ error: 'Missing or invalid "type" field' }, { status: 400 })
    }

    // For content types that expect arrays, validate
    const expectsArray = ['gallery', 'pricing', 'assets']
    if (expectsArray.includes(type) && !Array.isArray(newData)) {
      return jsonNoStore({ error: 'Expected "data" to be an array for type ' + type }, { status: 400 })
    }

    if (type === 'gallery') {
      const delRes = await supabase.from('gallery').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (delRes.error) {
        console.warn('Failed to clear gallery (will attempt insert anyway):', delRes.error)
      }

      const insertRes = await supabase.from('gallery').insert(sanitizeRows(newData))
      if (insertRes.error) {
        console.error('Failed to insert gallery:', insertRes.error)
        // If delete failed and insert also failed, return both messages if possible
        const message = insertRes.error.message || 'Failed to insert gallery'
        return jsonNoStore({ error: message }, { status: 500 })
      }

      return jsonNoStore({ success: true, warning: delRes.error?.message })
    }

    if (type === 'pricing') {
      const delRes = await supabase.from('pricing').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (delRes.error) {
        console.warn('Failed to clear pricing (will attempt insert anyway):', delRes.error)
      }

      const insertRes = await supabase.from('pricing').insert(sanitizeRows(newData))
      if (insertRes.error) {
        console.error('Failed to insert pricing:', insertRes.error)
        return jsonNoStore({ error: insertRes.error.message || 'Failed to insert pricing' }, { status: 500 })
      }

      return jsonNoStore({ success: true, warning: delRes.error?.message })
    } else if (type === 'assets') {
      const delRes = await supabase.from('assets').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (delRes.error) {
        console.warn('Failed to clear assets (will attempt insert anyway):', delRes.error)
      }

      const insertRes = await supabase.from('assets').insert(sanitizeRows(newData))
      if (insertRes.error) {
        console.error('Failed to insert assets:', insertRes.error)
        return jsonNoStore({ error: insertRes.error.message || 'Failed to insert assets' }, { status: 500 })
      }

      return jsonNoStore({ success: true, warning: delRes.error?.message })
    } else {
      return jsonNoStore({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Supabase Update Content Error:', error)
    return jsonNoStore({ error: (error && error.message) || String(error) || 'Failed to update content' }, { status: 500 })
  }
}
