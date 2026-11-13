'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const gameOptions = [
  ['roblox', 'Roblox'],
  ['mobile-legends', 'Mobile Legends: Bang Bang'],
  ['free-fire', 'Free Fire'],
  ['pubg-mobile', 'PUBG Mobile'],
  ['genshin-impact', 'Genshin Impact'],
  ['valorant', 'Valorant'],
  ['honor-of-kings', 'Honor of Kings'],
  ['call-of-duty-mobile', 'Call of Duty: Mobile'],
]

type Partner = { id: string; store_name: string; email: string; whatsapp: string; status: string }
type Product = { id: string; game_slug: string; name: string; amount: string; description: string; price: number; active: boolean }
type Order = { id: string; product_name: string; product_amount: string; customer_identifier: string; price: number; partner_amount: number; status: string; created_at: string }

export function PartnerDashboard() {
  const router = useRouter()
  const [partner, setPartner] = useState<Partner | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [gameSlug, setGameSlug] = useState('mobile-legends')
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')

  const loadDashboard = async () => {
    const meResponse = await fetch('/api/partners/me', { cache: 'no-store' })
    const me = await meResponse.json()
    if (!meResponse.ok || !me.partner) {
      router.replace('/partner/login')
      return
    }
    setPartner(me.partner)
    if (me.partner.status !== 'approved') return

    const [productResponse, orderResponse] = await Promise.all([
      fetch('/api/partners/products', { cache: 'no-store' }),
      fetch('/api/partners/orders', { cache: 'no-store' }),
    ])
    const productData = await productResponse.json()
    const orderData = await orderResponse.json()
    if (!productResponse.ok) throw new Error(productData.message || 'Gagal memuat produk.')
    if (!orderResponse.ok) throw new Error(orderData.message || 'Gagal memuat pesanan.')
    setProducts(productData.products || [])
    setOrders(orderData.orders || [])
  }

  useEffect(() => {
    loadDashboard()
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'Gagal memuat dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  const createProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/partners/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameSlug, name, amount, price: Number(price), description }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Gagal membuat produk.')
      setName('')
      setAmount('')
      setPrice('')
      setDescription('')
      await loadDashboard()
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Gagal membuat produk.')
    } finally {
      setBusy(false)
    }
  }

  const changeProduct = async (product: Product, updates: Record<string, unknown>) => {
    setError('')
    try {
      const response = await fetch(`/api/partners/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Gagal mengubah produk.')
      await loadDashboard()
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Gagal mengubah produk.')
    }
  }

  const updateOrder = async (orderId: string, status: 'processing' | 'completed') => {
    setError('')
    try {
      const response = await fetch('/api/partners/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Gagal mengubah status pesanan.')
      await loadDashboard()
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Gagal mengubah status pesanan.')
    }
  }

  const logout = async () => {
    await fetch('/api/partners/logout', { method: 'POST' })
    router.replace('/partner/login')
  }

  if (loading) return <main className="min-h-screen bg-[#030303] p-10 text-center text-white">Memuat dashboard partner...</main>
  if (!partner) return null

  return (
    <main className="min-h-screen bg-[#030303] px-4 py-24 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff7780]">Partner Dashboard</p>
            <h1 className="mt-2 text-3xl font-black">{partner.store_name}</h1>
            <p className="mt-1 text-sm text-white/50">{partner.email}</p>
          </div>
          <button onClick={logout} className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold hover:bg-white/10">Keluar</button>
        </header>

        {error && <p role="alert" className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>}

        {partner.status !== 'approved' ? (
          <section className="mt-10 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-6">
            <h2 className="text-xl font-black">Status toko: {partner.status}</h2>
            <p className="mt-2 text-sm text-white/70">
              {partner.status === 'pending'
                ? 'Pendaftaran sedang menunggu persetujuan admin. Produk dan toko belum tampil ke pelanggan.'
                : 'Akses toko belum aktif. Hubungi admin untuk informasi lebih lanjut.'}
            </p>
          </section>
        ) : (
          <>
            <section className="mt-8 rounded-2xl border border-white/10 bg-[#08111F]/85 p-5">
              <h2 className="text-xl font-black">Tambah produk</h2>
              <form onSubmit={createProduct} className="mt-4 grid gap-3 sm:grid-cols-2">
                <select value={gameSlug} onChange={(event) => setGameSlug(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white">
                  {gameOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <input required value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama paket (contoh: Weekly Pass)" className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white" />
                <input required value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Nominal (contoh: 86 Diamonds)" className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white" />
                <input required type="number" min="1000" max="100000000" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Harga dalam Rupiah" className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white" />
                <input value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} placeholder="Deskripsi (opsional)" className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white sm:col-span-2" />
                <button disabled={busy} className="rounded-xl bg-[#ff4655] px-4 py-3 font-black disabled:opacity-50 sm:col-span-2">{busy ? 'Menyimpan...' : 'Tambah paket'}</button>
              </form>
            </section>

            <section className="mt-8">
              <h2 className="text-xl font-black">Produk toko</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {products.map((product) => (
                  <article key={product.id} className="rounded-2xl border border-white/10 bg-[#08111F]/85 p-4">
                    <p className="text-xs uppercase text-[#ff7780]">{gameOptions.find(([value]) => value === product.game_slug)?.[1]}</p>
                    <h3 className="mt-2 font-black">{product.name} · {product.amount}</h3>
                    <p className="mt-1 text-sm text-white/60">Rp{Number(product.price).toLocaleString('id-ID')} · {product.active ? 'Aktif' : 'Nonaktif'}</p>
                    <button onClick={() => changeProduct(product, { active: !product.active })} className="mt-3 rounded-lg border border-white/15 px-3 py-2 text-xs font-bold">
                      {product.active ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>
                  </article>
                ))}
                {products.length === 0 && <p className="text-sm text-white/50">Belum ada produk yang dibuat.</p>}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-black">Pesanan</h2>
              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <article key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#08111F]/85 p-4">
                    <div>
                      <p className="font-black">{order.product_name} · {order.product_amount}</p>
                      <p className="mt-1 text-xs text-white/55">ID: {order.customer_identifier} · Status: {order.status}</p>
                      <p className="mt-1 text-xs text-white/55">Dibayar Rp{Number(order.price).toLocaleString('id-ID')} · Bagian partner Rp{Number(order.partner_amount).toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'paid' && <button onClick={() => updateOrder(order.id, 'processing')} className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-black text-black">Proses</button>}
                      {(order.status === 'paid' || order.status === 'processing') && <button onClick={() => updateOrder(order.id, 'completed')} className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-black text-black">Tandai selesai</button>}
                    </div>
                  </article>
                ))}
                {orders.length === 0 && <p className="text-sm text-white/50">Belum ada pesanan.</p>}
              </div>
            </section>
          </>
        )}

        <Link href="/topup-game" className="mt-10 inline-block text-sm text-white/50 hover:text-white">← Kembali ke toko game</Link>
      </div>
    </main>
  )
}
