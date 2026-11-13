import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

const supportedGames = new Set([
  'roblox',
  'mobile-legends',
  'free-fire',
  'pubg-mobile',
  'genshin-impact',
  'valorant',
  'honor-of-kings',
  'call-of-duty-mobile',
])

export async function GET(request: Request) {
  try {
    const game = new URL(request.url).searchParams.get('game')
    if (!game || !supportedGames.has(game)) {
      return NextResponse.json({ message: 'Game tidak valid.' }, { status: 400 })
    }

    const { data, error } = await getSupabaseAdmin()
      .from('partner_products')
      .select('id, game_slug, name, description, amount, price, partner_accounts!inner(id, store_name, status)')
      .eq('game_slug', game)
      .eq('active', true)
      .eq('partner_accounts.status', 'approved')
      .order('price', { ascending: true })

    if (error) throw error
    return NextResponse.json({ products: data }, {
      headers: { 'Cache-Control': 'public, max-age=30, stale-while-revalidate=60' },
    })
  } catch (error) {
    console.error('Partner catalog fetch failed:', error)
    return NextResponse.json({ message: 'Gagal memuat katalog partner.' }, { status: 500 })
  }
}
