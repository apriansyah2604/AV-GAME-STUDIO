import { NextResponse } from 'next/server'
import { hashPartnerPassword } from '@/lib/partner-auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const storeName = typeof body.storeName === 'string' ? body.storeName.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const whatsapp = typeof body.whatsapp === 'string' ? body.whatsapp.replace(/\D/g, '') : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (storeName.length < 2 || storeName.length > 60) {
      return NextResponse.json({ message: 'Nama toko harus 2–60 karakter.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ message: 'Email tidak valid.' }, { status: 400 })
    }
    if (whatsapp.length < 8 || whatsapp.length > 15) {
      return NextResponse.json({ message: 'Nomor WhatsApp tidak valid.' }, { status: 400 })
    }
    if (password.length < 10 || password.length > 128) {
      return NextResponse.json({ message: 'Password harus 10–128 karakter.' }, { status: 400 })
    }

    const passwordHash = await hashPartnerPassword(password)
    const { data, error } = await getSupabaseAdmin()
      .from('partner_accounts')
      .insert({
        store_name: storeName,
        email,
        whatsapp,
        password_hash: passwordHash,
        status: 'pending',
      })
      .select('id')
      .single()

    if (error?.code === '23505') {
      return NextResponse.json({ message: 'Email sudah terdaftar sebagai partner.' }, { status: 409 })
    }
    if (error) throw error

    return NextResponse.json({
      success: true,
      partnerId: data.id,
      message: 'Pendaftaran diterima. Toko akan aktif setelah disetujui admin.',
    }, { status: 201 })
  } catch (error) {
    console.error('Partner registration failed:', error)
    return NextResponse.json({ message: 'Pendaftaran partner gagal diproses.' }, { status: 500 })
  }
}
