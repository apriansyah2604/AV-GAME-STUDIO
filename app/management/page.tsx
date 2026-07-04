import Dashboard from '@/components/Dashboard'
import { ManagementNavbar } from '@/components/ManagementNavbar'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Roblox Account Manager | AV GAME STUDIO',
  description: 'Manage your Roblox accounts and control bot operations',
}

export default function Page() {
  return (
    <div className="min-h-screen bg-[#030303]">
      <ManagementNavbar />
      <main className="pt-24 pb-20">
        <Dashboard />
      </main>
      <Footer />
    </div>
  )
}
