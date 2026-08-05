import RuedaFortuna from '@/components/landing/RuedaFortuna'
import GithubLink from '@/components/ui/GithubLink'

export default function Home() {
  return (
    <main className='min-h-screen bg-linear-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-4 sm:p-8'>
      <div className='fixed top-6 right-6 z-10'><GithubLink /></div>
      <RuedaFortuna />
    </main>
  )
}