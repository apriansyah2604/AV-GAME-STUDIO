'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Partner = {
  id: string
  store_name: string
  email: string
  whatsapp: string
  status: string
  created_at: string
}

type PartnerOrder = {
  id: string
  product_name: string
  product_amount: string
  customer_identifier: string
  price: number
  platform_fee: number
  partner_amount: number
  status: string
  payout_status: string
  partner_accounts: { store_name: string; email: string } | { store_name: string; email: string }[]
}

export function AdminPartnerApprovals() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [orders, setOrders] = useState<PartnerOrder[]>([])
  const [references, setReferences] = useState<Record<string, string>>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const [partnersResponse, ordersResponse] = await Promise.all([
      fetch('/api/admin/partners', { cache: 'no-store' }),
      fetch('/api/admin/partner-orders', { cache: 'no-store' }),
    ])
    const [partnersResult, ordersResult] = await Promise.all([
      partnersResponse.json(),
      ordersResponse.json(),
    ])
    if (!partnersResponse.ok) throw new Error(partnersResult.message || 'Gagal mengambil daftar partner.')
    if (!ordersResponse.ok) throw new Error(ordersResult.message || 'Gagal mengambil laporan payout.')
    setPartners(partnersResult.partners || [])
    setOrders(ordersResult.orders || [])
  }

  const markPayoutPaid = async (orderId: string) => {
    setError('')
    try {
      const response = await fetch('/api/admin/partner-orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, payoutReference: references[orderId] || '' }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Gagal mencatat payout.')
      await load()
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Gagal mencatat payout.')
    }
  }

  useEffect(() => {
    load()
      .catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'Gagal memuat partner.'))
      .finally(() => setLoading(false))
  }, [])

  const updateStatus = async (partnerId: string, status: 'approved' | 'rejected' | 'suspended') => {
    setError('')
    try {
      const response = await fetch('/api/admin/partners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId, status }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Gagal mengubah status partner.')
      await load()
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Gagal mengubah status partner.')
    }
  }

  return (
    <main className="min-h-screen bg-[#030303] px-4 py-28 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="text-sm text-white/50 hover:text-white">← Dashboard admin</Link>
        <h1 className="mt-5 text-3xl font-black">Persetujuan toko partner</h1>
        <p className="mt-2 text-sm text-white/55">Toko yang disetujui akan tampil di katalog game.</p>
        {error && (
          <div role="alert" className="mt-6 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">
            {error}
            {error.includes('tidak terautentikasi') && (
              <span> Silakan <Link href="/login" className="underline">login dengan akun admin</Link>, lalu buka halaman ini lagi.</span>
            )}
          </div>
        )}
        {loading ? <p className="mt-8 text-white/55">Memuat...</p> : (
          <>
          <div className="mt-6 space-y-3">
            {partners.map((partner) => (
              <article key={partner.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#08111F]/85 p-5">
                <div>
                  <h2 className="font-black">{partner.store_name} <span className="ml-2 text-xs font-bold uppercase text-[#ff7780]">{partner.status}</span></h2>
                  <p className="mt-1 text-sm text-white/60">{partner.email} · WhatsApp {partner.whatsapp}</p>
                  <p className="mt-1 text-xs text-white/40">Daftar {new Date(partner.created_at).toLocaleString()}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {partner.status !== 'approved' && <button onClick={() => updateStatus(partner.id, 'approved')} className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-black text-black">Setujui</button>}
                  {partner.status !== 'rejected' && <button onClick={() => updateStatus(partner.id, 'rejected')} className="rounded-lg border border-red-400/30 px-3 py-2 text-xs font-black text-red-300">Tolak</button>}
                  {partner.status !== 'suspended' && partner.status === 'approved' && <button onClick={() => updateStatus(partner.id, 'suspended')} className="rounded-lg border border-amber-400/30 px-3 py-2 text-xs font-black text-amber-200">Suspend</button>}
                </div>
              </article>
            ))}
            {partners.length === 0 && <p className="rounded-xl border border-white/10 p-5 text-sm text-white/55">Belum ada pendaftaran partner.</p>}
          </div>
          <section className="mt-12">
            <h2 className="text-2xl font-black">Rekonsiliasi payout partner</h2>
            <p className="mt-2 text-sm text-white/55">Bagian partner adalah 95% dari pembayaran yang terverifikasi. Catat payout setelah pesanan selesai dan dana ditransfer.</p>
            <div className="mt-5 space-y-3">
              {orders.map((order) => {
                const partner = Array.isArray(order.partner_accounts) ? order.partner_accounts[0] : order.partner_accounts
                return (
                  <article key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#08111F]/85 p-5">
                    <div>
                      <h3 className="font-black">{partner?.store_name} · {order.product_name}</h3>
                      <p className="mt-1 text-xs text-white/55">Order {order.id} · {order.status}</p>
                      <p className="mt-1 text-sm text-white/70">Total Rp{Number(order.price).toLocaleString('id-ID')} · Fee 5% Rp{Number(order.platform_fee).toLocaleString('id-ID')} · Partner 95% Rp{Number(order.partner_amount).toLocaleString('id-ID')}</p>
                      <p className="mt-1 text-xs text-white/45">Payout: {order.payout_status}</p>
                    </div>
                    {order.payout_status === 'unpaid' && order.status === 'completed' && (
                      <div className="flex flex-wrap gap-2">
                        <input
                          value={references[order.id] || ''}
                          onChange={(event) => setReferences((previous) => ({ ...previous, [order.id]: event.target.value }))}
                          maxLength={120}
                          placeholder="Referensi transfer (opsional)"
                          className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-white"
                        />
                        <button onClick={() => markPayoutPaid(order.id)} className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-black text-black">Catat sudah dibayar</button>
                      </div>
                    )}
                  </article>
                )
              })}
              {orders.length === 0 && <p className="rounded-xl border border-white/10 p-5 text-sm text-white/55">Belum ada transaksi partner yang dibayar.</p>}
            </div>
          </section>
          </>
        )}
      </div>
    </main>
  )
}
