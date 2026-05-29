import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { FeaturedMaps } from '@/components/featured-maps'
import { Services } from '@/components/services'
import { Portfolio } from '@/components/portfolio'
import { Community } from '@/components/community'
import { Gallery } from '@/components/gallery'
import { Assets } from '@/components/assets'
import { TopUp } from '@/components/topup'
import { Pricing } from '@/components/pricing'
import { Contact } from '@/components/contact'
import { Footer } from '@/components/footer'
import { Particles } from '@/components/particles'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#030303]" suppressHydrationWarning>
      {/* Global Particles */}
      <Particles />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Sections */}
      <Hero />
      <FeaturedMaps />
      <Services />
      <Portfolio />
      <Community />
      <Gallery />
      <Assets />
      <TopUp />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  )
}
