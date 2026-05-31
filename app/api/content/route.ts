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

async function fetchContentTable(table: string, ascending = true) {
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending })
  if (error) {
    console.warn(`[GET /api/content] Failed to fetch ${table}:`, error.message)
    return []
  }

  return data || []
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const tableColumns: Record<string, string[]> = {
  pricing: ['name', 'price', 'badge', 'meta', 'stock', 'featured', 'description'],
  assets: ['title', 'price', 'badge', 'description'],
  gallery: ['title', 'src', 'category'],
}

function sanitizeRows(table: string, rows: any[]) {
  const allowedColumns = tableColumns[table] || []

  return rows.map((row) => {
    const cleanRow: Record<string, any> = {}

    if (typeof row.id === 'string' && uuidPattern.test(row.id)) {
      cleanRow.id = row.id
    }

    for (const column of allowedColumns) {
      if (row[column] !== undefined) {
        cleanRow[column] = row[column]
      }
    }

    return cleanRow
  })
}

async function saveContentRows(table: string, rows: any[]) {
  const sanitizedRows = sanitizeRows(table, rows)
  const rowsToUpdate = sanitizedRows.filter((row) => row.id)
  const rowsToInsert = sanitizedRows
    .filter((row) => !row.id)
    .map(({ id, ...row }) => row)
    .filter((row) => Object.keys(row).length > 0)

  if (rowsToUpdate.length > 0) {
    const updateRes = await supabase.from(table).upsert(rowsToUpdate, { onConflict: 'id' })
    if (updateRes.error) return updateRes
  }

  if (rowsToInsert.length > 0) {
    const insertRes = await supabase.from(table).insert(rowsToInsert)
    if (insertRes.error) return insertRes
  }

  return { error: null }
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
      const saveRes = await saveContentRows('gallery', newData)
      if (saveRes.error) {
        console.error('Failed to save gallery:', saveRes.error)
        // If delete failed and insert also failed, return both messages if possible
        const message = saveRes.error.message || 'Failed to save gallery'
        return jsonNoStore({ error: message }, { status: 500 })
      }

      return jsonNoStore({ success: true })
    }

    if (type === 'pricing') {
      const saveRes = await saveContentRows('pricing', newData)
      if (saveRes.error) {
        console.error('Failed to save pricing:', saveRes.error)
        return jsonNoStore({ error: saveRes.error.message || 'Failed to save pricing' }, { status: 500 })
      }

      return jsonNoStore({ success: true })
    } else if (type === 'assets') {
      const saveRes = await saveContentRows('assets', newData)
      if (saveRes.error) {
        console.error('Failed to save assets:', saveRes.error)
        return jsonNoStore({ error: saveRes.error.message || 'Failed to save assets' }, { status: 500 })
      }

      return jsonNoStore({ success: true })
    } else {
      return jsonNoStore({ error: 'Invalid type' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Supabase Update Content Error:', error)
    return jsonNoStore({ error: (error && error.message) || String(error) || 'Failed to update content' }, { status: 500 })
  }
}
