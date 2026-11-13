'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

type PartnerOrder = {
  id: string
  product_name: string
  product_amount: string
  customer_identifier: string
  price: number
  status: string
  partner_accounts: { store_name: string; whatsapp: string } | { store_name: string; whatsapp: string }[]
}

export function PartnerOrderStatus() {
  const params = useParams<{ id: string }>()
  const orderId = params.id
  const [order, setOrder] = useState<PartnerOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const check = async () => {
      try {
        const response = await fetch(`/api/partner-orders?id=${encodeURIComponent(orderId)}`, { cache: 'no-store' })
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || 'Status pesanan tidak dapat diperiksa.')
        if (active) setOrder(result.order)
      } catch (checkError) {
        if (active) setError(checkError instanceof Error ? checkError.message : 'Status pesanan tidak dapat diperiksa.')
      } finally {
        if (active) setLoading(false)
      }
    }

    check()
    return () => { active = false }
  }, [orderId])

  const partner = Array.isArray(order?.partner_accounts) ? order.partner_accounts[0] : order?.partner_accounts
  const paid = order && ['paid', 'processing', 'completed'].includes(order.status)
  const whatsappMessage = order
    ? `Halo, pembayaran pesanan saya sudah terverifikasi. Mohon proses pesanan ${order.product_name} (${order.product_amount}) untuk ID ${order.customer_identifier}. Order ID: ${order.id}`
    : ''

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#030303] px-4 py-20">
      <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#08111F]/90 p-6 text-center sm:p-9">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff7780]">Partner order</p>
        <h1 className="mt-3 text-2xl font-black text-white">Status pesanan</h1>
        <p className="mt-3 break-all text-xs text-white/45">{orderId}</p>

        {loading ? (
          <div className="mt-8 flex justify-center"><Loader2 className="h-7 w-7 animate-spin text-[#ff7780]" /></div>
        ) : error ? (
          <p role="alert" className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>
        ) : order ? (
          <>
            <div className="mt-7 rounded-xl border border-white/10 bg-black/30 p-5 text-left">
              <p className="font-black text-white">{order.product_name} · {order.product_amount}</p>
              <p className="mt-2 text-sm text-white/60">Toko: {partner?.store_name}</p>
              <p className="mt-1 text-sm text-white/60">Total: Rp{Number(order.price).toLocaleString('id-ID')}</p>
              <p className="mt-3 text-sm font-bold text-[#ff7780]">Status: {order.status.replaceAll('_', ' ')}</p>
            </div>
            {paid ? (
              <>
                <p className="mt-5 text-sm text-white/65">Pembayaran terverifikasi. Partner akan memproses item secara manual.</p>
                {partner?.whatsapp && (
                  <a
                    href={`https://wa.me/${partner.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex rounded-xl bg-emerald-500 px-5 py-3 font-black text-black hover:bg-emerald-400"
                  >
                    Chat partner di WhatsApp
                  </a>
                )}
              </>
            ) : (
              <p className="mt-5 text-sm text-amber-200">Pembayaran belum terkonfirmasi. Tunggu sebentar lalu muat ulang halaman ini.</p>
            )}
          </>
        ) : null}

        <Link href="/topup-game" className="mt-7 block text-sm text-white/45 hover:text-white">Kembali ke katalog game</Link>
      </section>
    </main>
  )
}
