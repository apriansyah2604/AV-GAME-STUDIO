import { notFound } from 'next/navigation'
import { Footer } from '@/components/footer'
import { GameTopUpPrices } from '@/components/GameTopUpPrices'
import { Navbar } from '@/components/navbar'
import { Particles } from '@/components/particles'
import { gameTopUpPricing } from '@/lib/game-topup-pricing'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return gameTopUpPricing.map(({ slug }) => ({ slug }))
}

export default async function GamePricePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const game = slug === 'roblox'
    ? { slug, name: 'Roblox', product: 'Robux' }
    : gameTopUpPricing.find((item) => item.slug === slug)

  if (!game) notFound()

  return (
    <div className="relative min-h-screen bg-[#030303]" suppressHydrationWarning>
      <Particles />
      <Navbar />
      <GameTopUpPrices game={game} />
      <Footer />
    </div>
  )
}
