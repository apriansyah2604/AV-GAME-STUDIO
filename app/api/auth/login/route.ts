import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Username and password login has been disabled. Sign in with Roblox instead.' },
    { status: 410 }
  )
}
