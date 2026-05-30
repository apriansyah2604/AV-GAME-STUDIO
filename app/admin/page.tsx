"use client"

import { useState, useEffect } from 'react'
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  Send, 
  Loader2, 
  Package, 
  Image as ImageIcon, 
  Plus, 
  Save, 
  Trash2,
  RefreshCw,
  Lock,
  Unlock
} from 'lucide-react'
import { toast } from 'sonner'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [is2FAVerified, setIs2FAVerified] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [activeTab, setActiveTab] = useState<'orders' | 'pricing' | 'assets' | 'gallery'>('orders')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [selectedProof, setSelectedProof] = useState<string | null>(null)
  
  // Content Management States
  const [packages, setPackages] = useState<any[]>([])
  const [avatarServices, setAvatarServices] = useState<any[]>([])
  const [gallery, setGallery] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch Orders
      const ordersRes = await fetch('/api/orders')
      const ordersData = await ordersRes.json()
      setOrders(Array.isArray(ordersData) ? [...ordersData].reverse() : [])

      // Fetch Content (Pricing & Assets)
      const contentRes = await fetch('/api/content')
      const contentData = await contentRes.json()
      if (contentData.robux_packages) setPackages(contentData.robux_packages)
      if (contentData.avatar_services) setAvatarServices(contentData.avatar_services)

      // Fetch Gallery
      const galleryRes = await fetch('/api/content?type=gallery')
      const galleryData = await galleryRes.json()
      if (Array.isArray(galleryData)) setGallery(galleryData)

    } catch (err) {
      toast.error('Gagal mengambil data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const savedKey = sessionStorage.getItem('admin_auth')
    const saved2FA = sessionStorage.getItem('admin_2fa')
    if (savedKey === 'avgame26' && saved2FA === 'verified') {
      setIsAuthenticated(true)
      setIs2FAVerified(true)
      fetchData()
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminKey === 'avgame26') {
      setIsAuthenticated(true)
      sessionStorage.setItem('admin_auth', adminKey)
      toast.success('Key Valid! Masukkan Kode OTP.')
      sendOtp()
    } else {
      toast.error('Admin Key Salah!')
    }
  }

  const sendOtp = async () => {
    setIsSendingOtp(true)
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(newOtp)
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: newOtp })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success('Kode OTP telah dikirim ke WhatsApp!')
      } else {
        // Fallback ke console jika gagal kirim WA
        console.log('--- AV STUDIO SECURITY (FALLBACK) ---')
        console.log('KODE OTP ANDA:', newOtp)
        console.log('-------------------------------------')
        toast.warning('Gagal kirim WA. Cek Console browser untuk kode.')
      }
    } catch (err) {
      console.error('Send OTP Error:', err)
      toast.error('Gagal menghubungi server OTP')
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (otpCode === generatedOtp) {
      setIs2FAVerified(true)
      sessionStorage.setItem('admin_2fa', 'verified')
      toast.success('Verifikasi Berhasil!')
      fetchData()
    } else {
      toast.error('Kode OTP Salah!')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIs2FAVerified(false)
    sessionStorage.removeItem('admin_auth')
    sessionStorage.removeItem('admin_2fa')
    toast.info('Logged out')
  }

  const handleApprove = async (order: any) => {
    if (!confirm(`Konfirmasi kirim ${order.package} ke ${order.username}?`)) return
    
    setProcessingId(order.id)
    try {
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
        // Update status di orders.json via API
        await fetch('/api/orders', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: order.id, status: 'completed' })
        })

        toast.success(`Berhasil! Robux terkirim ke ${order.username}`)
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

  // --- Pricing Management ---
  const handleUpdatePackage = (index: number, field: string, value: any) => {
    const newPackages = [...packages]
    newPackages[index] = { ...newPackages[index], [field]: value }
    setPackages(newPackages)
  }

  const handleSavePricing = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pricing', data: packages })
      })
      if (res.ok) toast.success('Harga Robux berhasil diperbarui!')
    } catch (err) {
      toast.error('Gagal menyimpan harga')
    } finally {
      setIsSaving(false)
    }
  }

  // --- Assets Management ---
  const handleUpdateAsset = (index: number, field: string, value: any) => {
    const newAssets = [...avatarServices]
    newAssets[index] = { ...newAssets[index], [field]: value }
    setAvatarServices(newAssets)
  }

  const handleSaveAssets = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'assets', data: avatarServices })
      })
      if (res.ok) toast.success('Katalog Aset berhasil diperbarui!')
    } catch (err) {
      toast.error('Gagal menyimpan aset')
    } finally {
      setIsSaving(false)
    }
  }

  // --- Gallery Management ---
  const handleUpdateGallery = (index: number, field: string, value: any) => {
    const newGallery = [...gallery]
    newGallery[index] = { ...newGallery[index], [field]: value }
    setGallery(newGallery)
  }

  const handleSaveGallery = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'gallery', data: gallery })
      })
      if (res.ok) toast.success('Galeri berhasil diperbarui!')
    } catch (err) {
      toast.error('Gagal menyimpan galeri')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isAuthenticated || !is2FAVerified) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0c0506] border border-white/5 p-12 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#ff4655]" />
          
          {!isAuthenticated ? (
            <>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#ff4655]/10 rounded-none skew-x-[-12deg] mb-4">
                  <Lock className="w-10 h-10 text-[#ff4655] -skew-x-[-12deg]" />
                </div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                  RESTRICTED <span className="text-[#ff4655]">AREA</span>
                </h1>
                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">Enter Admin Key to Access Dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <input 
                    type="password" 
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="ADMIN KEY"
                    className="w-full bg-white/5 border border-white/10 p-5 text-center text-xl font-black tracking-[0.5em] focus:border-[#ff4655] outline-none transition-all placeholder:tracking-normal placeholder:text-white/10"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#ff4655] text-white py-5 text-xs font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-[8px_8px_0_0_rgba(255,70,85,0.2)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  Verify Identity
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-none skew-x-[-12deg] mb-4">
                  <Unlock className="w-10 h-10 text-emerald-500 -skew-x-[-12deg]" />
                </div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter text-emerald-500">
                  2-STEP <span className="text-white">VERIFICATION</span>
                </h1>
                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">Enter the 6-digit code sent to you</p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="000000"
                    className="w-full bg-white/5 border border-white/10 p-5 text-center text-3xl font-black tracking-[0.8em] focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-emerald-500 text-white py-5 text-xs font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-[8px_8px_0_0_rgba(16,185,129,0.2)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  Confirm Code
                </button>
              </form>
              <div className="flex flex-col gap-2 pt-2">
                <button 
                  onClick={sendOtp}
                  disabled={isSendingOtp}
                  className="text-[10px] text-white/40 font-black uppercase tracking-widest hover:text-[#ff4655] transition-all disabled:opacity-30"
                >
                  {isSendingOtp ? 'Sending...' : 'Resend Code'}
                </button>
                <button 
                  onClick={() => setIsAuthenticated(false)}
                  className="text-[10px] text-white/20 font-black uppercase tracking-widest hover:text-white transition-all"
                >
                  ← Back to Login
                </button>
              </div>
            </>
          )}
          
          <p className="text-center text-[10px] text-white/20 font-bold uppercase tracking-widest pt-4">
            AV Studio Multi-Factor Auth
          </p>
        </div>
      </div>
    )
  }

  if (loading) return <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white font-black uppercase tracking-widest">Memuat Data AV Studio...</div>

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-32">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic">
              AV STUDIO <span className="text-[#ff4655]">ADMIN</span>
            </h1>
            <p className="text-white/40 font-bold uppercase text-xs mt-2 tracking-[0.3em]">Content & Payout Management</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData} 
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-8 py-4 text-xs font-black uppercase hover:bg-white/10 transition-all active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#ff4655]/10 border border-[#ff4655]/20 px-8 py-4 text-xs font-black uppercase text-[#ff4655] hover:bg-[#ff4655]/20 transition-all active:scale-95"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Custom Tabs */}
        <div className="flex gap-2 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {[
            { id: 'orders', label: 'Pesanan Masuk', icon: Send },
            { id: 'pricing', label: 'Harga Robux', icon: Package },
            { id: 'assets', label: 'Katalog Aset', icon: ImageIcon },
            { id: 'gallery', label: 'Galeri Foto', icon: ImageIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-8 py-4 text-xs font-black uppercase tracking-widest transition-all skew-x-[-12deg] ${
                activeTab === tab.id 
                ? 'bg-[#ff4655] text-white shadow-[8px_8px_0_0_rgba(255,70,85,0.2)]' 
                : 'bg-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-4 h-4 -skew-x-[-12deg]" />
              <span className="-skew-x-[-12deg]">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab: Orders */}
        {activeTab === 'orders' && (
          <div className="grid gap-4">
            {orders.length === 0 ? (
              <div className="text-center py-32 border border-white/5 bg-white/5 rounded-2xl">
                <p className="text-white/20 font-black uppercase tracking-widest">Belum ada pesanan masuk</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-[#0c0506] border border-white/5 p-8 flex flex-wrap items-center justify-between gap-8 group hover:border-[#ff4655]/30 transition-all">
                  <div className="flex items-center gap-8">
                    <div className={`w-16 h-16 flex items-center justify-center skew-x-[-12deg] ${
                      order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {order.status === 'completed' ? <CheckCircle2 className="-skew-x-[-12deg] w-8 h-8" /> : <Clock className="-skew-x-[-12deg] w-8 h-8" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-4 mb-1">
                        <h3 className="text-2xl font-black uppercase italic tracking-tight">{order.username}</h3>
                        <span className="text-[10px] bg-white/5 px-3 py-1 border border-white/10 text-white/40 font-black uppercase tracking-widest">{order.id}</span>
                      </div>
                      <p className="text-sm text-[#ff4655] font-black uppercase tracking-widest">{order.package} • {order.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setSelectedProof(order.proof)}
                      className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 text-[10px] font-black uppercase hover:bg-white/10 transition-all"
                    >
                      <Eye className="w-4 h-4" /> Lihat Bukti
                    </button>
                    
                    {order.status !== 'completed' && (
                      <button 
                        onClick={() => handleApprove(order)}
                        disabled={processingId === order.id}
                        className="flex items-center gap-3 bg-[#ff4655] text-white px-8 py-4 text-[10px] font-black uppercase hover:brightness-110 disabled:opacity-50 transition-all shadow-[4px_4px_0_0_rgba(255,70,85,0.3)]"
                      >
                        {processingId === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Kirim Robux
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Pricing */}
        {activeTab === 'pricing' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black italic uppercase tracking-tight">Daftar Paket Robux</h2>
              <button 
                onClick={handleSavePricing}
                disabled={isSaving}
                className="flex items-center gap-3 bg-[#ff4655] text-white px-8 py-4 text-[10px] font-black uppercase hover:brightness-110 disabled:opacity-50 transition-all shadow-[4px_4px_0_0_rgba(255,70,85,0.3)]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Harga
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {packages.map((pkg, idx) => (
                <div key={idx} className="bg-[#0c0506] border border-white/5 p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Nama Paket</label>
                      <input 
                        type="text" 
                        value={pkg.name} 
                        onChange={(e) => handleUpdatePackage(idx, 'name', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold focus:border-[#ff4655] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Harga (Rp)</label>
                      <input 
                        type="text" 
                        value={pkg.price} 
                        onChange={(e) => handleUpdatePackage(idx, 'price', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold focus:border-[#ff4655] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Badge (e.g. HOT)</label>
                      <input 
                        type="text" 
                        value={pkg.badge || ''} 
                        onChange={(e) => handleUpdatePackage(idx, 'badge', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold focus:border-[#ff4655] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Status Stok</label>
                      <select 
                        value={pkg.stock} 
                        onChange={(e) => handleUpdatePackage(idx, 'stock', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold focus:border-[#ff4655] outline-none transition-all appearance-none"
                      >
                        <option value="Ready">Ready</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Deskripsi</label>
                    <textarea 
                      value={pkg.description || ''} 
                      onChange={(e) => handleUpdatePackage(idx, 'description', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold focus:border-[#ff4655] outline-none transition-all min-h-[100px]"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setPackages(packages.filter((_, i) => i !== idx))}
                      className="flex items-center gap-2 text-[#ff4655] text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-all"
                    >
                      <Trash2 className="w-3 h-3" /> Hapus Paket
                    </button>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={pkg.featured || false} 
                        onChange={(e) => handleUpdatePackage(idx, 'featured', e.target.checked)}
                        className="w-4 h-4 accent-[#ff4655]"
                      />
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Featured</span>
                    </label>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setPackages([...packages, { name: '100 Robux', price: 'Rp 15.000', description: '', badge: 'FAST', meta: '5-15 Menit', stock: 'Ready', featured: false }])}
                className="border-2 border-dashed border-white/10 p-12 flex flex-col items-center justify-center hover:border-[#ff4655]/50 hover:bg-[#ff4655]/5 transition-all group"
              >
                <Plus className="w-8 h-8 text-white/20 group-hover:text-[#ff4655] mb-4 transition-all" />
                <span className="text-white/20 group-hover:text-[#ff4655] font-black uppercase tracking-widest text-xs transition-all">Tambah Paket Baru</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab: Assets */}
        {activeTab === 'assets' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black italic uppercase tracking-tight">Katalog Aset Game</h2>
              <button 
                onClick={handleSaveAssets}
                disabled={isSaving}
                className="flex items-center gap-3 bg-[#ff4655] text-white px-8 py-4 text-[10px] font-black uppercase hover:brightness-110 disabled:opacity-50 transition-all shadow-[4px_4px_0_0_rgba(255,70,85,0.3)]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Katalog
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {avatarServices.map((asset, idx) => (
                <div key={idx} className="bg-[#0c0506] border border-white/5 p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Judul Layanan</label>
                    <input 
                      type="text" 
                      value={asset.title} 
                      onChange={(e) => handleUpdateAsset(idx, 'title', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold focus:border-[#ff4655] outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Badge</label>
                      <input 
                        type="text" 
                        value={asset.badge || ''} 
                        onChange={(e) => handleUpdateAsset(idx, 'badge', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold focus:border-[#ff4655] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Harga</label>
                      <input 
                        type="text" 
                        value={asset.price} 
                        onChange={(e) => handleUpdateAsset(idx, 'price', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold focus:border-[#ff4655] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Deskripsi</label>
                    <textarea 
                      value={asset.description || ''} 
                      onChange={(e) => handleUpdateAsset(idx, 'description', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 p-4 text-sm font-bold focus:border-[#ff4655] outline-none transition-all min-h-[100px]"
                    />
                  </div>
                  <button 
                    onClick={() => setAvatarServices(avatarServices.filter((_, i) => i !== idx))}
                    className="flex items-center gap-2 text-[#ff4655] text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-all"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus Layanan
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setAvatarServices([...avatarServices, { title: 'Layanan Baru', description: '', price: 'Rp 0', badge: 'NEW' }])}
                className="border-2 border-dashed border-white/10 p-12 flex flex-col items-center justify-center hover:border-[#ff4655]/50 hover:bg-[#ff4655]/5 transition-all group"
              >
                <Plus className="w-8 h-8 text-white/20 group-hover:text-[#ff4655] mb-4 transition-all" />
                <span className="text-white/20 group-hover:text-[#ff4655] font-black uppercase tracking-widest text-xs transition-all">Tambah Layanan Baru</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab: Gallery */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black italic uppercase tracking-tight">Manajemen Galeri</h2>
              <button 
                onClick={handleSaveGallery}
                disabled={isSaving}
                className="flex items-center gap-3 bg-[#ff4655] text-white px-8 py-4 text-[10px] font-black uppercase hover:brightness-110 disabled:opacity-50 transition-all shadow-[4px_4px_0_0_rgba(255,70,85,0.3)]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan Galeri
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item, idx) => (
                <div key={idx} className="bg-[#0c0506] border border-white/5 p-6 space-y-4 group">
                  <div className="aspect-video bg-white/5 border border-white/10 overflow-hidden relative">
                    {item.src && (
                      <img src={item.src} alt={item.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {!item.src && <ImageIcon className="w-8 h-8 text-white/10" />}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Judul Foto</label>
                      <input 
                        type="text" 
                        value={item.title} 
                        onChange={(e) => handleUpdateGallery(idx, 'title', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-3 text-xs font-bold focus:border-[#ff4655] outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">URL Gambar (Direct Link)</label>
                      <input 
                        type="text" 
                        value={item.src} 
                        onChange={(e) => handleUpdateGallery(idx, 'src', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-3 text-xs font-bold focus:border-[#ff4655] outline-none transition-all"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Kategori</label>
                      <input 
                        type="text" 
                        value={item.category} 
                        onChange={(e) => handleUpdateGallery(idx, 'category', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-3 text-xs font-bold focus:border-[#ff4655] outline-none transition-all"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                    className="flex items-center gap-2 text-[#ff4655] text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-all pt-2"
                  >
                    <Trash2 className="w-3 h-3" /> Hapus Foto
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setGallery([...gallery, { id: Date.now(), src: '', title: 'New Photo', category: 'General' }])}
                className="border-2 border-dashed border-white/10 p-12 flex flex-col items-center justify-center hover:border-[#ff4655]/50 hover:bg-[#ff4655]/5 transition-all group aspect-video lg:aspect-auto"
              >
                <Plus className="w-8 h-8 text-white/20 group-hover:text-[#ff4655] mb-4 transition-all" />
                <span className="text-white/20 group-hover:text-[#ff4655] font-black uppercase tracking-widest text-xs transition-all">Tambah Foto Baru</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal Lihat Bukti */}
      {selectedProof && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md" onClick={() => setSelectedProof(null)}>
          <div className="max-w-3xl w-full relative" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedProof(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#ff4655] font-black uppercase text-xs tracking-widest flex items-center gap-2"
            >
              Tutup Panel (✕)
            </button>
            <div className="bg-white p-2 skew-y-[-2deg] shadow-[20px_20px_0_0_rgba(255,70,85,0.2)]">
              <img src={selectedProof} alt="Bukti Transfer" className="w-full h-auto" />
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}
