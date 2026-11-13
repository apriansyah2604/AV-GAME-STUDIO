import { NextResponse } from 'next/server'
import { getApprovedPartner } from '@/lib/partner-auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    const partner = await getApprovedPartner()
    if (!partner) return NextResponse.json({ message: 'Toko belum disetujui atau sesi berakhir.' }, { status: 403 })

    const { data, error } = await getSupabaseAdmin()
      .from('partner_orders')
      .select('id, game_slug, product_name, product_amount, customer_identifier, customer_email, price, platform_fee, partner_amount, status, created_at')
      .eq('partner_id', partner.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ orders: data }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Partner order list failed:', error)
    return NextResponse.json({ message: 'Gagal mengambil pesanan partner.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const partner = await getApprovedPartner()
    if (!partner) return NextResponse.json({ message: 'Toko belum disetujui atau sesi berakhir.' }, { status: 403 })

    const body = await request.json()
    const orderId = typeof body.orderId === 'string' ? body.orderId : ''
    const nextStatus = body.status
    if (!/^PARTNER-[0-9a-f-]{36}$/i.test(orderId) ||
      (nextStatus !== 'processing' && nextStatus !== 'completed')) {
      return NextResponse.json({ message: 'Perubahan status pesanan tidak valid.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { data: order, error: fetchError } = await supabase
      .from('partner_orders')
      .select('status')
      .eq('id', orderId)
      .eq('partner_id', partner.id)
      .maybeSingle()

    if (fetchError) throw fetchError
    if (!order) return NextResponse.json({ message: 'Pesanan tidak ditemukan.' }, { status: 404 })

    const allowed = nextStatus === 'processing'
      ? ['paid']
      : ['paid', 'processing']
    if (!allowed.includes(order.status)) {
      return NextResponse.json({ message: 'Pesanan harus sudah dibayar sebelum diproses.' }, { status: 409 })
    }

    const { data, error } = await supabase
      .from('partner_orders')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .eq('partner_id', partner.id)
      .in('status', allowed)
      .select('id, status')
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ message: 'Status pesanan berubah. Muat ulang lalu coba lagi.' }, { status: 409 })
    return NextResponse.json({ order: data })
  } catch (error) {
    console.error('Partner order update failed:', error)
    return NextResponse.json({ message: 'Gagal memperbarui status pesanan.' }, { status: 500 })
  }
}
