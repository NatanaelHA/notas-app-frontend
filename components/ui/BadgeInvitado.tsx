'use client'

import { fetchUserAttributes } from 'aws-amplify/auth'
import { Clock, Copy, Check, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { useProximaLimpieza } from '@/hooks/useProximaLimpieza'
import { obtenerCredencialesInvitado } from '@/lib/invitadoStorage'

export default function BadgeInvitado() {
  const [esInvitado, setEsInvitado] = useState(false)
  const [expandido, setExpandido] = useState(false)
  const [copiado, setCopiado] = useState<'email' | 'password' | null>(null)
  const { minutos, segundos } = useProximaLimpieza()
  const credenciales = obtenerCredencialesInvitado()

  useEffect(() => {
    fetchUserAttributes()
      .then((attrs) => setEsInvitado(attrs['custom:esInvitado'] === 'true'))
      .catch(() => setEsInvitado(false))
  }, [])

  const copiar = async (texto: string, campo: 'email' | 'password') => {
    await navigator.clipboard.writeText(texto)
    setCopiado(campo)
    setTimeout(() => setCopiado(null), 1500)
  }

  return (
    <AnimatePresence>
      {esInvitado && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className='fixed bottom-6 right-6 left-6 sm:left-auto sm:w-auto z-40 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl shadow-lg overflow-hidden'
        >
          <button
            onClick={() => setExpandido(!expandido)}
            className='w-max flex items-center justify-center gap-1.5 text-base text-amber-600 dark:text-amber-400 px-3 py-2'
          >
            <Clock size={15} className='shrink-0' />
            <span className='whitespace-nowrap sm:whitespace-normal'>
              Cuenta de 24h de uso · limpieza global en {minutos}m {segundos}s
            </span>
            <ChevronDown
              size={15}
              className={`shrink-0 transition-transform ${expandido ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {expandido && credenciales && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className='border-t border-amber-200 dark:border-amber-900 px-3 py-3 space-y-2'
              >
                <p className='text-xs text-amber-700 dark:text-amber-300'>
                  Guarda estos datos si quieres volver a esta sesión más tarde:
                </p>
                <button
                  onClick={() => copiar(credenciales.email, 'email')}
                  className='w-full flex items-center justify-between gap-2 text-xs bg-white dark:bg-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200'
                >
                  <span className='truncate'>{credenciales.email}</span>
                  {copiado === 'email' ? (
                    <Check size={13} className='shrink-0 text-emerald-500' />
                  ) : (
                    <Copy size={13} className='shrink-0' />
                  )}
                </button>
                <button
                  onClick={() => copiar(credenciales.password, 'password')}
                  className='w-full flex items-center justify-between gap-2 text-xs bg-white dark:bg-slate-800 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200'
                >
                  <span className='truncate'>{credenciales.password}</span>
                  {copiado === 'password' ? (
                    <Check size={13} className='shrink-0 text-emerald-500' />
                  ) : (
                    <Copy size={13} className='shrink-0' />
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
