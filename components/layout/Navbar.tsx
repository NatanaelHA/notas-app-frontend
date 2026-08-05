'use client'

import { signOut, fetchUserAttributes } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import { NotebookPen, LogOut, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Spinner from '@/components/ui/Spinner'
import { eliminarCredencialesInvitado } from '@/lib/invitadoStorage'
import GithubLink from '@/components/ui/GithubLink'

const ThemeToggle = dynamic(() => import('@/components/ui/ThemeToggle'), {
  ssr: false,
})

export default function Navbar() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [cerrandoSesion, setCerrandoSesion] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)

  useEffect(() => {
    fetchUserAttributes()
      .then((attrs) => setEmail(attrs.email ?? null))
      .catch(() => setEmail(null))
  }, [])

  const handleSignOut = async () => {
    setCerrandoSesion(true)
    eliminarCredencialesInvitado()
    await signOut()
    router.refresh()
    router.replace('/login')
  }

  return (
    <>
      <nav className='relative bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between gap-3'>
        {/* Lado izquierdo: logo + título + email del usuario (email solo visible en desktop) */}
        <div className='flex items-center gap-2 min-w-0'>
          <NotebookPen size={22} className='text-blue-600 dark:text-blue-400 shrink-0' />
          <h1 className='font-bold text-slate-900 dark:text-slate-100 text-lg shrink-0'>
            Notas App
          </h1>
          {email && (
            <>
              <span className='hidden sm:inline text-slate-300 dark:text-slate-600'>|</span>
              <span className='hidden sm:inline text-sm text-slate-500 dark:text-slate-400 truncate'>
                {email}
              </span>
            </>
          )}
        </div>

        {/* Lado derecho: iconos SIEMPRE visibles (Github, tema), y "Cerrar sesión" / menú según pantalla */}
        <div className='flex items-center gap-2 sm:gap-4'>
          <GithubLink />
          <ThemeToggle />

          {/* Divisor y botón "Cerrar sesión" con texto, solo DESKTOP */}
          <div className='hidden sm:block w-px h-5 bg-slate-200 dark:bg-slate-700' />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMostrarConfirmacion(true)}
            className='hidden sm:flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors font-medium'
          >
            <LogOut size={16} />
            Cerrar sesión
          </motion.button>

          {/* Botón trigger del menú, solo MÓVIL */}
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className='sm:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
          >
            {menuAbierto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Panel desplegable del menú: solo email + cerrar sesión, solo MÓVIL */}
        <AnimatePresence>
          {menuAbierto && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='sm:hidden absolute top-full right-0 left-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg p-4 space-y-3 z-30'
            >
              {email && (
                <p className='text-sm text-slate-500 dark:text-slate-400 break-all px-2'>
                  {email}
                </p>
              )}
              <button
                onClick={() => {
                  setMenuAbierto(false)
                  setMostrarConfirmacion(true)
                }}
                className='w-full flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg px-2 py-2 transition-colors'
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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