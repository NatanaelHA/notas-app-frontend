import Navbar from '@/components/layout/Navbar'
import BadgeInvitado from '@/components/ui/BadgeInvitado'
import BfcacheGuard from '@/components/ui/BfcacheGuard'

export default function NotasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='min-h-screen bg-linear-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950'>
      <Navbar />
      <main className='p-8'>
        {children}
      </main>
      <BadgeInvitado />
      <BfcacheGuard />
    </div>
  )
}