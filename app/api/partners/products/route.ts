import { NextResponse } from 'next/server'
import { getApprovedPartner } from '@/lib/partner-auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const allowedGames = new Set([
  'roblox',
  'mobile-legends',
  'free-fire',
  'pubg-mobile',
  'genshin-impact',
  'valorant',
  'honor-of-kings',
  'call-of-duty-mobile',
])

export async function GET() {
  try {
    const partner = await getApprovedPartner()
    if (!partner) return NextResponse.json({ message: 'Toko belum disetujui atau sesi berakhir.' }, { status: 403 })

    const { data, error } = await getSupabaseAdmin()
      .from('partner_products')
      .select('id, game_slug, name, description, amount, price, active, created_at')
      .eq('partner_id', partner.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ products: data }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Partner product fetch failed:', error)
    return NextResponse.json({ message: 'Gagal mengambil produk partner.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const partner = await getApprovedPartner()
    if (!partner) return NextResponse.json({ message: 'Toko belum disetujui atau sesi berakhir.' }, { status: 403 })

    const body = await request.json()
    const gameSlug = typeof body.gameSlug === 'string' ? body.gameSlug : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const amount = typeof body.amount === 'string' ? body.amount.trim() : ''
    const description = typeof body.description === 'string' ? body.description.trim() : ''
    const price = Number(body.price)

    if (!allowedGames.has(gameSlug) || name.length < 2 || name.length > 100 ||
      amount.length < 1 || amount.length > 100 || description.length > 500 ||
      !Number.isSafeInteger(price) || price < 1000 || price > 100000000) {
      return NextResponse.json({ message: 'Data produk tidak valid. Harga harus Rp1.000–Rp100.000.000.' }, { status: 400 })
    }

    const { data, error } = await getSupabaseAdmin()
      .from('partner_products')
      .insert({
        partner_id: partner.id,
        game_slug: gameSlug,
        name,
        amount,
        description,
        price,
      })
      .select('id, game_slug, name, description, amount, price, active, created_at')
      .single()

    if (error) throw error
    return NextResponse.json({ product: data }, { status: 201 })
  } catch (error) {
    console.error('Partner product creation failed:', error)
    return NextResponse.json({ message: 'Gagal membuat produk partner.' }, { status: 500 })
  }
}
