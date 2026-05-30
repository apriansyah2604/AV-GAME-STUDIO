import type { Metadata, Viewport } from 'next'
import { Orbitron, Inter, Plus_Jakarta_Sans, Anton, Barlow_Condensed } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/context/LanguageContext'
import { TransitionProvider } from '@/context/TransitionContext'
import { SceneTransition } from '@/components/scene-transition'
import Script from 'next/script'
import './globals.css'

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: '--font-orbitron',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-jakarta',
  display: 'swap',
})

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
})

const barlow = Barlow_Condensed({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-barlow',
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
    <html lang="en" className={`${orbitron.variable} ${jakarta.variable} ${inter.variable} ${anton.variable} ${barlow.variable} bg-[#030303]`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-[#030303] text-white overflow-x-hidden" suppressHydrationWarning>
        <Script 
          src={process.env.MIDTRANS_IS_PRODUCTION === 'true' 
            ? "https://app.midtrans.com/snap/snap.js" 
            : "https://app.sandbox.midtrans.com/snap/snap.js"} 
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="beforeInteractive"
        />
        <LanguageProvider>
          <TransitionProvider>
            <SceneTransition />
            {children}
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </TransitionProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
