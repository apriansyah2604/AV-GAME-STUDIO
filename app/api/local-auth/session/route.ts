import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { user: null, error: 'Username and password sessions have been disabled.' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } }
  )
}
