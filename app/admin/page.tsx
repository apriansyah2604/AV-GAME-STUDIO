"use client"

import { useState, useEffect } from 'react'
import { CheckCircle2, XCircle, Clock, Eye, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [selectedProof, setSelectedProof] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data.reverse()) // Terbaru di atas
    } catch (err) {
      toast.error('Gagal mengambil data pesanan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleApprove = async (order: any) => {
    if (!confirm(`Konfirmasi kirim ${order.package} ke ${order.username}?`)) return
    
    setProcessingId(order.id)
    try {
      // Panggil API Payout Bot yang asli
      const amount = parseInt(order.package.replace(/[^0-9]/g, ''))
      const res = await fetch('/api/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: order.username,
          amount: amount,
          secret: 'av-studio-super-secret-key'
        })
      })

      const data = await res.json()

      if (data.success) {
        toast.success(`Berhasil! Robux terkirim ke ${order.username}`)
        // Update status di file local (opsional, untuk demo kita hanya update state)
        setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'completed' } : o))
      } else {
        toast.error(`Gagal: ${data.message}`)
      }
    } catch (err) {
      toast.error('Terjadi kesalahan sistem')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white font-black">MEMUAT DATA...</div>

  return (
    <div className="min-h-screen bg-[#030303] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight italic">
              AV STUDIO <span className="text-[#ff4655]">ADMIN</span>
            </h1>
            <p className="text-white/40 font-bold uppercase text-xs mt-2 tracking-widest">Manajemen Payout Otomatis</p>
          </div>
          <button onClick={fetchOrders} className="bg-white/5 border border-white/10 px-6 py-2 text-xs font-black uppercase hover:bg-white/10 transition-all">
            Refresh Data
          </button>
        </header>

        <div className="grid gap-4">
          {orders.length === 0 ? (
            <div className="text-center py-20 border border-white/5 bg-white/5">
              <p className="text-white/20 font-black uppercase">Belum ada pesanan masuk</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-[#0c0506] border border-white/5 p-6 flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 flex items-center justify-center skew-x-[-12deg] ${
                    order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {order.status === 'completed' ? <CheckCircle2 className="-skew-x-[-12deg]" /> : <Clock className="-skew-x-[-12deg]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-black uppercase">{order.username}</h3>
                      <span className="text-[10px] bg-white/5 px-2 py-0.5 border border-white/10 text-white/40">{order.id}</span>
                    </div>
                    <p className="text-sm text-[#ff4655] font-bold uppercase">{order.package} • {order.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedProof(order.proof)}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-3 text-[10px] font-black uppercase hover:bg-white/10"
                  >
                    <Eye className="w-3 h-3" /> Lihat Bukti
                  </button>
                  
                  {order.status !== 'completed' && (
                    <button 
                      onClick={() => handleApprove(order)}
                      disabled={processingId === order.id}
                      className="flex items-center gap-2 bg-[#ff4655] text-white px-6 py-3 text-[10px] font-black uppercase hover:brightness-110 disabled:opacity-50"
                    >
                      {processingId === order.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Send className="w-3 h-3" />
                      )}
                      Kirim Robux
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Lihat Bukti */}
      {selectedProof && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md">
          <div className="max-w-3xl w-full relative">
            <button 
              onClick={() => setSelectedProof(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#ff4655] font-black"
            >
              TUTUP (✕)
            </button>
            <div className="bg-white p-2">
              <img src={selectedProof} alt="Bukti Transfer" className="w-full h-auto shadow-2xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
