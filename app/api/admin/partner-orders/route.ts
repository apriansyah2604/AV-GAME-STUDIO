import { NextResponse } from 'next/server'
import { getAuthenticatedAdmin } from '@/lib/admin-session'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin()
    if (!admin) return NextResponse.json({ message: 'Admin tidak terautentikasi.' }, { status: 401 })

    const { data, error } = await getSupabaseAdmin()
      .from('partner_orders')
      .select('id, product_name, product_amount, customer_identifier, price, platform_fee, partner_amount, status, payout_status, payout_reference, paid_out_at, created_at, partner_accounts!inner(store_name, email)')
      .in('status', ['paid', 'processing', 'completed'])
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ orders: data }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Admin partner order list failed:', error)
    return NextResponse.json({ message: 'Gagal mengambil laporan payout partner.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const admin = await getAuthenticatedAdmin()
    if (!admin) return NextResponse.json({ message: 'Admin tidak terautentikasi.' }, { status: 401 })

    const body = await request.json()
    const orderId = typeof body.orderId === 'string' ? body.orderId : ''
    const payoutReference = typeof body.payoutReference === 'string' ? body.payoutReference.trim() : ''
    if (!/^PARTNER-[0-9a-f-]{36}$/i.test(orderId) || payoutReference.length > 120) {
      return NextResponse.json({ message: 'Data payout tidak valid.' }, { status: 400 })
    }

    const { data, error } = await getSupabaseAdmin()
      .from('partner_orders')
      .update({
        payout_status: 'paid',
        payout_reference: payoutReference || null,
        paid_out_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .eq('status', 'completed')
      .eq('payout_status', 'unpaid')
      .select('id, payout_status, paid_out_at')
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ message: 'Pesanan belum selesai atau payout sudah dicatat.' }, { status: 409 })
    return NextResponse.json({ order: data })
  } catch (error) {
    console.error('Admin partner payout update failed:', error)
    return NextResponse.json({ message: 'Gagal mencatat payout partner.' }, { status: 500 })
  }
}
