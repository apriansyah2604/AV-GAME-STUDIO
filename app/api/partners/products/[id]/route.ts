import { NextResponse } from 'next/server'
import { getApprovedPartner } from '@/lib/partner-auth'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const partner = await getApprovedPartner()
    if (!partner) return NextResponse.json({ message: 'Toko belum disetujui atau sesi berakhir.' }, { status: 403 })

    const { id } = await context.params
    const body = await request.json()
    const updates: Record<string, unknown> = {}

    if (typeof body.active === 'boolean') updates.active = body.active
    if (typeof body.name === 'string') {
      const name = body.name.trim()
      if (name.length < 2 || name.length > 100) return NextResponse.json({ message: 'Nama produk tidak valid.' }, { status: 400 })
      updates.name = name
    }
    if (typeof body.amount === 'string') {
      const amount = body.amount.trim()
      if (!amount || amount.length > 100) return NextResponse.json({ message: 'Nominal produk tidak valid.' }, { status: 400 })
      updates.amount = amount
    }
    if (typeof body.description === 'string') {
      if (body.description.length > 500) return NextResponse.json({ message: 'Deskripsi terlalu panjang.' }, { status: 400 })
      updates.description = body.description.trim()
    }
    if (body.price !== undefined) {
      const price = Number(body.price)
      if (!Number.isSafeInteger(price) || price < 1000 || price > 100000000) {
        return NextResponse.json({ message: 'Harga harus Rp1.000–Rp100.000.000.' }, { status: 400 })
      }
      updates.price = price
    }
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: 'Tidak ada perubahan produk.' }, { status: 400 })
    }

    updates.updated_at = new Date().toISOString()
    const { data, error } = await getSupabaseAdmin()
      .from('partner_products')
      .update(updates)
      .eq('id', id)
      .eq('partner_id', partner.id)
      .select('id, game_slug, name, description, amount, price, active, created_at')
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ message: 'Produk tidak ditemukan.' }, { status: 404 })
    return NextResponse.json({ product: data })
  } catch (error) {
    console.error('Partner product update failed:', error)
    return NextResponse.json({ message: 'Gagal memperbarui produk partner.' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const partner = await getApprovedPartner()
    if (!partner) return NextResponse.json({ message: 'Toko belum disetujui atau sesi berakhir.' }, { status: 403 })

    const { id } = await context.params
    const { data, error } = await getSupabaseAdmin()
      .from('partner_products')
      .delete()
      .eq('id', id)
      .eq('partner_id', partner.id)
      .select('id')
      .maybeSingle()

    if (error) throw error
    if (!data) return NextResponse.json({ message: 'Produk tidak ditemukan.' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Partner product delete failed:', error)
    return NextResponse.json({ message: 'Gagal menghapus produk partner.' }, { status: 500 })
  }
}
