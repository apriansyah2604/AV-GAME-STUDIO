"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, Plus, Trash2, Link as LinkIcon, Loader2, CheckCircle2, 
  ShoppingBag, Map as MapIcon, Wrench, CreditCard, LayoutDashboard,
  Save
} from 'lucide-react'

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('gallery')
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  
  // Data States
  const [gallery, setGallery] = useState<any[]>([])
  const [siteContent, setSiteContent] = useState<any>({
    robux_packages: [],
    avatar_services: [],
    featured_maps: [],
    services: [],
    pricing_plans: []
  })

  const ADMIN_PASSWORD = 'avgame26'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true)
    } else {
      alert('Password salah!')
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchData()
    }
  }, [isLoggedIn])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [galleryRes, contentRes] = await Promise.all([
        fetch('/api/gallery'),
        fetch('/api/content')
      ])
      const galleryData = await galleryRes.json()
      const contentData = await contentRes.json()
      setGallery(galleryData)
      setSiteContent(contentData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async (newContent: any) => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      })
      if (res.ok) {
        setMessage('Konten berhasil disimpan!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      alert('Gagal menyimpan konten')
    } finally {
      setIsSaving(false)
    }
  }

  // Gallery Form State
  const [galleryForm, setGalleryForm] = useState({ src: '', title: '', category: 'Community' })

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryForm)
      })
      if (res.ok) {
        setGalleryForm({ src: '', title: '', category: 'Community' })
        fetchData()
        setMessage('Foto ditambahkan!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteGallery = async (id: number) => {
    if (!confirm('Hapus foto ini?')) return
    await fetch('/api/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    fetchData()
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center p-6 font-sans">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-strong p-8 rounded-none border border-[#ff4655]/20 w-full max-w-md text-center">
          <LayoutDashboard className="w-12 h-12 text-[#ff4655] mx-auto mb-4" />
          <h1 className="text-2xl font-black mb-6 uppercase tracking-tight">AV Admin Access</h1>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password..." className="w-full bg-[#111827] border border-white/10 rounded-none py-3 px-4 focus:border-[#ff4655] outline-none font-bold" />
            <button className="w-full bg-[#ff4655] text-white font-black py-3 rounded-none skew-x-[-12deg] transition-all hover:brightness-110">
              <span className="skew-x-[12deg] inline-block">MASUK</span>
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-64 glass-strong border-r border-white/5 p-6 space-y-2">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-8 h-8 rounded-none bg-[#ff4655] flex items-center justify-center text-white font-black skew-x-[-12deg]">
              <span className="skew-x-[12deg]">AV</span>
            </div>
            <span className="font-black tracking-normal uppercase">DASHBOARD</span>
          </div>
        
        {[
          { id: 'gallery', icon: Camera, label: 'Gallery' },
          { id: 'topup', icon: ShoppingBag, label: 'Robux' },
          { id: 'avatar', icon: ShoppingBag, label: 'Avatar Services' },
          { id: 'maps', icon: MapIcon, label: 'Featured Maps' },
          { id: 'services', icon: Wrench, label: 'Services' },
          { id: 'pricing', icon: CreditCard, label: 'Pricing' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-none transition-all ${
              activeTab === tab.id ? 'bg-[#ff4655] text-white skew-x-[-12deg]' : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className={`flex items-center gap-3 ${activeTab === tab.id ? 'skew-x-[12deg]' : ''}`}>
              <tab.icon className="w-5 h-5" />
              <span className="font-black text-xs uppercase tracking-normal">{tab.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {message && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-none bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2 font-bold uppercase text-xs">
              <CheckCircle2 className="w-5 h-5" /> {message}
            </motion.div>
          )}

          {loading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-[#ff4655] animate-spin" /></div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'gallery' && (
                <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-black mb-8 uppercase tracking-tight">Kelola Galeri</h2>
                  <form onSubmit={handleAddGallery} className="glass-strong p-6 rounded-none border border-white/5 mb-10 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input value={galleryForm.src} onChange={e => setGalleryForm({...galleryForm, src: e.target.value})} placeholder="Link Google Drive..." className="bg-[#111827] border border-white/10 p-3 rounded-none outline-none focus:border-[#ff4655] font-bold" required />
                      <input value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} placeholder="Judul Foto..." className="bg-[#111827] border border-white/10 p-3 rounded-none outline-none focus:border-[#ff4655] font-bold" required />
                    </div>
                    <button className="w-full bg-[#ff4655] text-white font-black py-4 rounded-none skew-x-[-12deg] flex items-center justify-center gap-2 transition-all hover:brightness-110">
                      <span className="skew-x-[12deg] flex items-center gap-2">
                        <Plus className="w-5 h-5" /> TAMBAH FOTO
                      </span>
                    </button>
                  </form>
                  <div className="grid gap-3">
                    {gallery.map(item => (
                      <div key={item.id} className="glass p-4 rounded-none border border-white/5 flex items-center justify-between">
                        <span className="font-black text-xs uppercase tracking-normal">{item.title}</span>
                        <button onClick={() => handleDeleteGallery(item.id)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-none"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'topup' && (
                <motion.div key="topup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Robux Packages</h2>
                    <button onClick={() => saveContent(siteContent)} className="bg-[#ff4655] text-white px-6 py-2 rounded-none font-black skew-x-[-12deg] flex items-center gap-2 transition-all hover:brightness-110">
                      <span className="skew-x-[12deg] flex items-center gap-2">
                        <Save className="w-4 h-4" /> SIMPAN SEMUA
                      </span>
                    </button>
                  </div>
                  <div className="space-y-6">
                    {siteContent.robux_packages.map((pkg: any, idx: number) => (
                      <div key={idx} className="glass-strong p-6 rounded-none border border-white/5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input value={pkg.name} onChange={e => {
                            const newPkgs = [...siteContent.robux_packages];
                            newPkgs[idx].name = e.target.value;
                            setSiteContent({...siteContent, robux_packages: newPkgs});
                          }} className="bg-[#111827] border border-white/10 p-2 rounded-none font-bold" />
                          <input value={pkg.price} onChange={e => {
                            const newPkgs = [...siteContent.robux_packages];
                            newPkgs[idx].price = e.target.value;
                            setSiteContent({...siteContent, robux_packages: newPkgs});
                          }} className="bg-[#111827] border border-white/10 p-2 rounded-none font-bold text-[#ff4655]" />
                        </div>
                        <textarea value={pkg.description} onChange={e => {
                          const newPkgs = [...siteContent.robux_packages];
                          newPkgs[idx].description = e.target.value;
                          setSiteContent({...siteContent, robux_packages: newPkgs});
                        }} className="w-full bg-[#111827] border border-white/10 p-2 rounded-none h-20 text-sm font-medium" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'avatar' && (
                <motion.div key="avatar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Avatar Services</h2>
                    <button onClick={() => saveContent(siteContent)} className="bg-[#ff4655] text-white px-6 py-2 rounded-none font-black skew-x-[-12deg] flex items-center gap-2 transition-all hover:brightness-110">
                      <span className="skew-x-[12deg] flex items-center gap-2">
                        <Save className="w-4 h-4" /> SIMPAN
                      </span>
                    </button>
                  </div>
                  <div className="space-y-6">
                    {siteContent.avatar_services.map((service: any, idx: number) => (
                      <div key={idx} className="glass-strong p-6 rounded-none border border-white/5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input value={service.title} onChange={e => {
                            const newServices = [...siteContent.avatar_services];
                            newServices[idx].title = e.target.value;
                            setSiteContent({...siteContent, avatar_services: newServices});
                          }} className="bg-[#111827] border border-white/10 p-2 rounded-none font-bold" />
                          <input value={service.price} onChange={e => {
                            const newServices = [...siteContent.avatar_services];
                            newServices[idx].price = e.target.value;
                            setSiteContent({...siteContent, avatar_services: newServices});
                          }} className="bg-[#111827] border border-white/10 p-2 rounded-none font-bold text-[#ff4655]" />
                        </div>
                        <textarea value={service.description} onChange={e => {
                          const newServices = [...siteContent.avatar_services];
                          newServices[idx].description = e.target.value;
                          setSiteContent({...siteContent, avatar_services: newServices});
                        }} className="w-full bg-[#111827] border border-white/10 p-2 rounded-none h-20 text-sm font-medium" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'maps' && (
                <motion.div key="maps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Featured Maps</h2>
                    <button onClick={() => saveContent(siteContent)} className="bg-[#ff4655] text-white px-6 py-2 rounded-none font-black skew-x-[-12deg] flex items-center gap-2 transition-all hover:brightness-110">
                      <span className="skew-x-[12deg] flex items-center gap-2">
                        <Save className="w-4 h-4" /> SIMPAN
                      </span>
                    </button>
                  </div>
                  <div className="space-y-6">
                    {siteContent.featured_maps.map((map: any, idx: number) => (
                      <div key={idx} className="glass-strong p-6 rounded-none border border-white/5 space-y-4">
                        <input value={map.title} onChange={e => {
                          const newMaps = [...siteContent.featured_maps];
                          newMaps[idx].title = e.target.value;
                          setSiteContent({...siteContent, featured_maps: newMaps});
                        }} className="w-full bg-[#111827] border border-white/10 p-2 rounded-none font-black uppercase tracking-tight" />
                        <input value={map.robloxUrl} onChange={e => {
                          const newMaps = [...siteContent.featured_maps];
                          newMaps[idx].robloxUrl = e.target.value;
                          setSiteContent({...siteContent, featured_maps: newMaps});
                        }} placeholder="Link Roblox" className="w-full bg-[#111827] border border-white/10 p-2 rounded-none text-xs text-white/40" />
                        <textarea value={map.description} onChange={e => {
                          const newMaps = [...siteContent.featured_maps];
                          newMaps[idx].description = e.target.value;
                          setSiteContent({...siteContent, featured_maps: newMaps});
                        }} className="w-full bg-[#111827] border border-white/10 p-2 rounded-none h-20 text-sm font-medium" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'services' && (
                <motion.div key="services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Our Services</h2>
                    <button onClick={() => saveContent(siteContent)} className="bg-[#ff4655] text-white px-6 py-2 rounded-none font-black skew-x-[-12deg] flex items-center gap-2 transition-all hover:brightness-110">
                      <span className="skew-x-[12deg] flex items-center gap-2">
                        <Save className="w-4 h-4" /> SIMPAN
                      </span>
                    </button>
                  </div>
                  <div className="space-y-6">
                    {siteContent.services.map((service: any, idx: number) => (
                      <div key={idx} className="glass-strong p-6 rounded-none border border-white/5 space-y-4">
                        <input value={service.title} onChange={e => {
                          const newServices = [...siteContent.services];
                          newServices[idx].title = e.target.value;
                          setSiteContent({...siteContent, services: newServices});
                        }} className="w-full bg-[#111827] border border-white/10 p-2 rounded-none font-black uppercase tracking-tight" />
                        <textarea value={service.description} onChange={e => {
                          const newServices = [...siteContent.services];
                          newServices[idx].description = e.target.value;
                          setSiteContent({...siteContent, services: newServices});
                        }} className="w-full bg-[#111827] border border-white/10 p-2 rounded-none h-20 text-sm font-medium" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'pricing' && (
                <motion.div key="pricing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Pricing Plans</h2>
                    <button onClick={() => saveContent(siteContent)} className="bg-[#ff4655] text-white px-6 py-2 rounded-none font-black skew-x-[-12deg] flex items-center gap-2 transition-all hover:brightness-110">
                      <span className="skew-x-[12deg] flex items-center gap-2">
                        <Save className="w-4 h-4" /> SIMPAN
                      </span>
                    </button>
                  </div>
                  <div className="space-y-6">
                    {siteContent.pricing_plans.map((plan: any, idx: number) => (
                      <div key={idx} className="glass-strong p-6 rounded-none border border-white/5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <input value={plan.name} onChange={e => {
                            const newPlans = [...siteContent.pricing_plans];
                            newPlans[idx].name = e.target.value;
                            setSiteContent({...siteContent, pricing_plans: newPlans});
                          }} className="bg-[#111827] border border-white/10 p-2 rounded-none font-black uppercase tracking-tight" />
                          <div className="grid grid-cols-2 gap-2">
                            <input value={plan.price_idr} onChange={e => {
                              const newPlans = [...siteContent.pricing_plans];
                              newPlans[idx].price_idr = e.target.value;
                              setSiteContent({...siteContent, pricing_plans: newPlans});
                            }} className="bg-[#111827] border border-white/10 p-2 rounded-none font-bold text-[#ff4655] text-xs" placeholder="IDR" />
                            <input value={plan.price_usd} onChange={e => {
                              const newPlans = [...siteContent.pricing_plans];
                              newPlans[idx].price_usd = e.target.value;
                              setSiteContent({...siteContent, pricing_plans: newPlans});
                            }} className="bg-[#111827] border border-white/10 p-2 rounded-none font-bold text-white/50 text-xs" placeholder="USD" />
                          </div>
                        </div>
                        <textarea value={plan.description} onChange={e => {
                          const newPlans = [...siteContent.pricing_plans];
                          newPlans[idx].description = e.target.value;
                          setSiteContent({...siteContent, pricing_plans: newPlans});
                        }} className="w-full bg-[#111827] border border-white/10 p-2 rounded-none h-16 text-sm font-medium" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
