import Navbar from '@/components/layout/Navbar'

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
    </div>
  )
}