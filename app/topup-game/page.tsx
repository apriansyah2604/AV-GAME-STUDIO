import { Footer } from '@/components/footer'
import { GameTopUpSelector } from '@/components/GameTopUpSelector'
import { Navbar } from '@/components/navbar'
import { Particles } from '@/components/particles'

export const dynamic = 'force-dynamic'

export default function GameTopUpPage() {
  return (
    <div className="relative min-h-screen bg-[#030303]" suppressHydrationWarning>
      <Particles />
      <Navbar />
      <GameTopUpSelector />
      <Footer />
    </div>
  )
}
