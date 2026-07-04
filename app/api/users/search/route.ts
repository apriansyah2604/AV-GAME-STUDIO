import { NextRequest, NextResponse } from 'next/server'
import {
  formatErrorResponse,
  formatSuccessResponse,
} from '@/lib/validation'
import { searchRobloxUsers } from '@/lib/roblox'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        formatErrorResponse('Kueri pencarian wajib diisi', 'MISSING_QUERY'),
        { status: 400 }
      )
    }

    const results = await searchRobloxUsers(query.trim(), 50)

    return NextResponse.json(
      formatSuccessResponse({ results })
    )
  } catch (error) {
    console.error('Search users error:', error)
    return NextResponse.json(
      formatErrorResponse(
        error instanceof Error ? error.message : 'Gagal mencari pengguna',
        'SEARCH_FAILED'
      ),
      { status: 500 }
    )
  }
}
