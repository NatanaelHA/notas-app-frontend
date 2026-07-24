import LoginForm from '@/components/auth/LoginForm'

export const metadata = {
  title: 'Iniciar sesión - Notas App'
}

export default async function LoginPage() {

  return (
    <main className='min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950'>
      <div className='w-full max-w-md bg-white dark:bg-slate-800 shadow-xl dark:shadow-black/30 rounded-2xl p-8 border border-slate-100 dark:border-slate-700'>
        <h1 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-center'>
          Iniciar sesión
        </h1>
        <LoginForm />
      </div>
    </main>
  )
}