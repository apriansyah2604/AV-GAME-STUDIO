import { Navbar } from '@/components/navbar'
import { TopUp } from '@/components/topup'
import { Footer } from '@/components/footer'
import { Particles } from '@/components/particles'

export default function TopUpPage() {
  return (
    <div className="relative min-h-screen bg-[#030303]" suppressHydrationWarning>
      <Particles />
      <Navbar />
      
      <main className="pt-20">
        <TopUp />
      </main>
      
      <Footer />
    </div>
  )
}
