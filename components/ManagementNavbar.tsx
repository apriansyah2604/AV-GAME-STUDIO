'use client'

import Link from 'next/link'
import { Settings, User, Gamepad2, Users, MessageSquare, Activity, Home } from 'lucide-react'

export function ManagementNavbar() {
  return (
    <nav className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Kembali ke Home */}
          <div className="flex items-center gap-6">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-white hover:text-[#ff4655] transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-black uppercase tracking-tight hidden sm:block">Home</span>
            </Link>
            
            <div className="h-6 w-px bg-white/20" />
            
            <span className="text-white font-black uppercase tracking-tight text-sm">
              Roblox Account Manager
            </span>
          </div>

          {/* Menu */}
          <div className="flex items-center gap-4">
            <Link 
              href="#dashboard" 
              className="text-sm font-medium text-white/70 hover:text-[#ff4655] transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:block">Dashboard</span>
            </Link>
            
            <Link 
              href="#accounts" 
              className="text-sm font-medium text-white/70 hover:text-[#ff4655] transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block">Accounts</span>
            </Link>
            
            <Link 
              href="#friends" 
              className="text-sm font-medium text-white/70 hover:text-[#ff4655] transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:block">Friends</span>
            </Link>
            
            <Link 
              href="#messages" 
              className="text-sm font-medium text-white/70 hover:text-[#ff4655] transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:block">Messages</span>
            </Link>
            
            <Link 
              href="#bot" 
              className="text-sm font-medium text-white/70 hover:text-[#ff4655] transition-colors flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden sm:block">Bot Control</span>
            </Link>
            
            <Link 
              href="#settings" 
              className="text-sm font-medium text-white/70 hover:text-[#ff4655] transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:block">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
