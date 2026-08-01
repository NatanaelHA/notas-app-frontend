'use client'

import { signOut, fetchUserAttributes } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import { NotebookPen, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Spinner from '@/components/ui/Spinner'
import { eliminarCredencialesInvitado } from '@/lib/invitadoStorage'

const ThemeToggle = dynamic(() => import('@/components/ui/ThemeToggle'), {
  ssr: false,
})

export default function Navbar() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [cerrandoSesion, setCerrandoSesion] = useState(false)

  useEffect(() => {
    fetchUserAttributes()
      .then((attrs) => setEmail(attrs.email ?? null))
      .catch(() => setEmail(null))
  }, [])

  const handleSignOut = async () => {
    setCerrandoSesion(true)
    eliminarCredencialesInvitado()
    await signOut()
    router.push('/login')
  }

  return (
    <>
      <nav className='bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <NotebookPen size={22} className='text-blue-600 dark:text-blue-400' />
          <h1 className='font-bold text-slate-900 dark:text-slate-100 text-lg'>
            Notas App
          </h1>
          {email && (
            <>
              <span className='text-slate-300 dark:text-slate-600'>|</span>
              <span className='text-sm text-slate-500 dark:text-slate-400'>
                {email}
              </span>
            </>
          )}
        </div>
        <div className='flex items-center gap-4'>
          <ThemeToggle />
          <div className='w-px h-5 bg-slate-200 dark:bg-slate-700' />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMostrarConfirmacion(true)}
            className='flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors font-medium'
          >
            <LogOut size={16} />
            Cerrar sesión
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {mostrarConfirmacion && (
          <ConfirmDialog
            titulo='Cerrar sesión'
            mensaje='¿Seguro que quieres cerrar sesión?'
            onCancelar={() => setMostrarConfirmacion(false)}
            acciones={[
              {
                label: cerrandoSesion ? 'Cerrando...' : 'Cerrar sesión',
                icono: cerrandoSesion ? <Spinner size={14} /> : undefined,
                disabled: cerrandoSesion,
                onClick: handleSignOut,
                variant: 'primary',
              },
            ]}
          />
        )}
      </AnimatePresence>
    </>
  )
}