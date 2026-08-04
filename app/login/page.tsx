import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import LoginForm from '@/components/auth/LoginForm'
import AnimatedBackground from '@/components/ui/AnimatedBackground'

export const metadata = {
  title: 'Iniciar sesión - Notas App',
}

export default async function LoginPage() {
  return (
    <main className='relative min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden'>
      <AnimatedBackground />

      <Link
        href='/'
        className='absolute top-6 left-6 z-10 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors'
      >
        <ArrowLeft size={16} />
        Volver
      </Link>

      <div className='relative z-10 w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-xl dark:shadow-black/50 rounded-2xl p-8 border border-slate-100 dark:border-slate-800'>
        <h1 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-center'>
          Iniciar sesión
        </h1>
        <LoginForm />
      </div>
    </main>
  )
}