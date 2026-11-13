import { NextResponse } from 'next/server'
import { getPartnerIdentity } from '@/lib/partner-auth'

export async function GET() {
  try {
    const partner = await getPartnerIdentity()
    if (!partner) return NextResponse.json({ partner: null }, { status: 401 })
    return NextResponse.json({ partner }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Partner session lookup failed:', error)
    return NextResponse.json({ message: 'Tidak dapat memeriksa sesi partner.' }, { status: 500 })
  }
}
