'use client'

import { fetchUserAttributes } from 'aws-amplify/auth'
import { Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import { useProximaLimpieza } from '@/hooks/useProximaLimpieza'

export default function BadgeInvitado() {
  const [esInvitado, setEsInvitado] = useState(false)
  const { minutos, segundos } = useProximaLimpieza()

  useEffect(() => {
    fetchUserAttributes()
      .then((attrs) => setEsInvitado(attrs['custom:esInvitado'] === 'true'))
      .catch(() => setEsInvitado(false))
  }, [])

  return (
    <AnimatePresence>
      {esInvitado && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className='fixed bottom-6 right-6 left-6 sm:left-auto z-40 flex items-center justify-center sm:justify-start gap-1.5 text-base text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-3 py-2 rounded-full shadow-lg'
        >
          <Clock size={15} className='shrink-0' />
          <span className='truncate'>
            Cuenta de 24h de uso · limpieza global en {minutos}m {segundos}s
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
