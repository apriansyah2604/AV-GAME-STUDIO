import { NextResponse } from 'next/server'
import { setPartnerSession, verifyPartnerPassword } from '@/lib/partner-auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!email || !password) {
      return NextResponse.json({ message: 'Email dan password wajib diisi.' }, { status: 400 })
    }

    const { data: partner, error } = await getSupabaseAdmin()
      .from('partner_accounts')
      .select('id, password_hash, status')
      .eq('email', email)
      .maybeSingle()

    if (error) throw error
    if (!partner || !(await verifyPartnerPassword(password, partner.password_hash))) {
      return NextResponse.json({ message: 'Email atau password salah.' }, { status: 401 })
    }

    await setPartnerSession(partner.id)
    return NextResponse.json({ success: true, status: partner.status })
  } catch (error) {
    console.error('Partner login failed:', error)
    return NextResponse.json({ message: 'Login partner gagal diproses.' }, { status: 500 })
  }
}
