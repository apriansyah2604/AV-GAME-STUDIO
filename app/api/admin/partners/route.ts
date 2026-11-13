import { NextResponse } from 'next/server'
import { getAuthenticatedAdmin } from '@/lib/admin-session'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin()
    if (!admin) return NextResponse.json({ message: 'Admin tidak terautentikasi.' }, { status: 401 })

    const { data, error } = await getSupabaseAdmin()
      .from('partner_accounts')
      .select('id, store_name, email, whatsapp, status, created_at')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ partners: data }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Admin partner list failed:', error)
    return NextResponse.json({ message: 'Gagal mengambil pendaftaran partner.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await getAuthenticatedAdmin()
    if (!admin) return NextResponse.json({ message: 'Admin tidak terautentikasi.' }, { status: 401 })

    const body = await request.json()
    const partnerId = typeof body.partnerId === 'string' ? body.partnerId : ''
    const status = body.status
    if (!/^[0-9a-f-]{36}$/i.test(partnerId) || !['approved', 'rejected', 'suspended'].includes(status)) {
      return NextResponse.json({ message: 'Partner atau status tidak valid.' }, { status: 400 })
    }

    const { data, error } = await getSupabaseAdmin()
      .from('partner_accounts')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', partnerId)
      .select('id, status')
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ message: 'Partner tidak ditemukan.' }, { status: 404 })
    return NextResponse.json({ partner: data })
  } catch (error) {
    console.error('Admin partner status update failed:', error)
    return NextResponse.json({ message: 'Gagal memperbarui status partner.' }, { status: 500 })
  }
}
