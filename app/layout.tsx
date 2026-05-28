import type { Metadata, Viewport } from 'next'
import { Orbitron, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: '--font-orbitron',
  display: 'swap',
})

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AV GAME STUDIO | Premium Roblox Development',
  description: 'Building Premium Roblox Experiences. Professional game development, advanced scripting, and next-gen gaming solutions.',
  keywords: ['Roblox', 'Game Development', 'Roblox Maps', 'Gaming Studio', 'Scripting', 'VFX'],
  authors: [{ name: 'AV Game Studio' }],
}

export const viewport: Viewport = {
  themeColor: '#030303',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${inter.variable} bg-[#030303]`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#030303] text-white overflow-x-hidden" suppressHydrationWarning>
        <LanguageProvider>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </LanguageProvider>
      </body>
    </html>
  )
}
