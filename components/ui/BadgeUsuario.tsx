'use client'

import { fetchUserAttributes } from 'aws-amplify/auth'
import { CalendarClock, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { useProximaLimpiezaSemanal } from '@/hooks/useProximaLimpiezaSemanal'

export default function BadgeUsuario() {
  const [esUsuarioReal, setEsUsuarioReal] = useState(false)
  const [expandido, setExpandido] = useState(false)
  const { dias, horas, minutos } = useProximaLimpiezaSemanal()

  useEffect(() => {
    fetchUserAttributes()
      .then((attrs) =>
        setEsUsuarioReal(attrs['custom:esInvitado'] !== 'true'),
      )
      .catch(() => setEsUsuarioReal(false))
  }, [])

  return (
    <AnimatePresence>
      {esUsuarioReal && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className='fixed bottom-6 right-6 left-6 sm:left-auto sm:w-auto z-40 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-2xl shadow-lg overflow-hidden'
        >
          <button
            onClick={() => setExpandido(!expandido)}
            className='w-full sm:w-max flex items-center justify-center gap-1.5 text-sm sm:text-base text-blue-600 dark:text-blue-400 px-3 py-2 whitespace-nowrap'
          >
            <CalendarClock size={15} className='shrink-0' />
            <span>
              Limpieza semanal · {dias}d {horas}h {minutos}m
            </span>
            <ChevronDown
              size={15}
              className={`shrink-0 transition-transform ${expandido ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {expandido && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className='border-t border-blue-200 dark:border-blue-900 px-3 py-3'
              >
                <p className='max-w-sm text-xs text-blue-700 dark:text-blue-300'>
                  Cada domingo a las 03:00 tus notas se eliminan. Puedes
                  descargarlas en PDF antes de la próxima limpieza, que será en{' '}
                  {dias}d {horas}h {minutos}m.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
