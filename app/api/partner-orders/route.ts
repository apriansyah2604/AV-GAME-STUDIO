import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { createTransaction } from '@/lib/midtrans'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { getTransactionStatus } from '@/lib/midtrans'
import { confirmPartnerOrder } from '@/lib/partner-orders'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const productId = typeof body.productId === 'string' ? body.productId : ''
    const customerIdentifier = typeof body.customerIdentifier === 'string'
      ? body.customerIdentifier.trim()
      : ''
    const customerEmail = typeof body.customerEmail === 'string'
      ? body.customerEmail.trim().toLowerCase()
      : ''

    if (!productId || customerIdentifier.length < 2 || customerIdentifier.length > 100 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) || customerEmail.length > 254) {
      return NextResponse.json({ message: 'ID game dan email pelanggan wajib valid.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { data: product, error: productError } = await supabase
      .from('partner_products')
      .select('id, partner_id, game_slug, name, amount, price, active, partner_accounts!inner(status)')
      .eq('id', productId)
      .eq('active', true)
      .eq('partner_accounts.status', 'approved')
      .maybeSingle()

    if (productError) throw productError
    if (!product) return NextResponse.json({ message: 'Produk tidak tersedia.' }, { status: 404 })

    const price = Number(product.price)
    const platformFee = Math.round(price * 0.05)
    const partnerAmount = price - platformFee
    const orderId = `PARTNER-${randomUUID()}`
    const { error: orderError } = await supabase
      .from('partner_orders')
      .insert({
        id: orderId,
        partner_id: product.partner_id,
        product_id: product.id,
        game_slug: product.game_slug,
        product_name: product.name,
        product_amount: product.amount,
        customer_identifier: customerIdentifier,
        customer_email: customerEmail,
        price,
        platform_fee: platformFee,
        partner_amount: partnerAmount,
        status: 'pending_payment',
      })

    if (orderError) throw orderError

    const siteUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL
    if (!siteUrl) throw new Error('NEXTAUTH_URL or NEXT_PUBLIC_SITE_URL must be configured.')
    const redirectUrl = new URL(`/topup-game/orders/${orderId}`, siteUrl).toString()
    const transaction = await createTransaction(
      orderId,
      price,
      [{ id: product.id, price, quantity: 1, name: `${product.name} - ${product.amount}` }],
      { first_name: customerIdentifier.slice(0, 50), email: customerEmail },
      { username: customerIdentifier.slice(0, 50), robux_amount: 0 },
      redirectUrl,
    )

    return NextResponse.json({
      success: true,
      orderId,
      redirect_url: transaction.redirect_url,
      token: transaction.token,
    })
  } catch (error) {
    console.error('Partner order checkout failed:', error)
    return NextResponse.json({ message: 'Checkout partner gagal dibuat.' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const orderId = new URL(request.url).searchParams.get('id')
    if (!orderId || !/^PARTNER-[0-9a-f-]{36}$/i.test(orderId)) {
      return NextResponse.json({ message: 'Nomor pesanan tidak valid.' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('partner_orders')
      .select('id, game_slug, product_name, product_amount, customer_identifier, price, status, partner_accounts!inner(store_name, whatsapp)')
      .eq('id', orderId)
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ message: 'Pesanan tidak ditemukan.' }, { status: 404 })

    let order = data
    if (['pending_payment', 'cancelled'].includes(data.status)) {
      const transaction = await getTransactionStatus(orderId)
      const paid = transaction.transaction_status === 'settlement'
        || (transaction.transaction_status === 'capture' && transaction.fraud_status !== 'challenge')
      if (paid) {
        const result = await confirmPartnerOrder(orderId, Number(transaction.gross_amount))
        if (!result.success) {
          return NextResponse.json({ message: result.message }, { status: 409 })
        }
        const { data: refreshed, error: refreshError } = await supabase
          .from('partner_orders')
          .select('id, game_slug, product_name, product_amount, customer_identifier, price, status, partner_accounts!inner(store_name, whatsapp)')
          .eq('id', orderId)
          .single()
        if (refreshError) throw refreshError
        order = refreshed
      }
    }

    return NextResponse.json({ order }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Partner order status lookup failed:', error)
    return NextResponse.json({ message: 'Gagal memuat status pesanan.' }, { status: 500 })
  }
}
