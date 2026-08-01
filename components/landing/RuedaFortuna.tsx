'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { tarjetasLanding, TarjetaLanding } from '@/lib/landingContent'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { LogIn } from 'lucide-react'

const RADIO = 280

export default function RuedaFortuna() {
  const router = useRouter()
  const [pausado, setPausado] = useState(false)
  const [tarjetaAbierta, setTarjetaAbierta] = useState<TarjetaLanding | null>(null)

  return (
    <div className='relative w-full h-175 flex items-center justify-center'>
      <motion.div
        className='absolute rounded-full border-2 border-dashed border-blue-300 dark:border-blue-800'
        style={{ width: RADIO * 2 + 100, height: RADIO * 2 + 100 }}
        animate={pausado ? {} : { rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />

      <div className='z-10'>
        <Button
          variant='indigo'
          icon={<LogIn size={20} />}
          onClick={() => router.push('/login')}
          className='px-8 py-4 text-base'
        >
          Iniciar sesión
        </Button>
      </div>

      {tarjetasLanding.map((tarjeta, i) => {
        const anguloGrados = (360 / tarjetasLanding.length) * i - 90
        const anguloRad = (anguloGrados * Math.PI) / 180
        const x = RADIO * Math.cos(anguloRad)
        const y = RADIO * Math.sin(anguloRad)

        return (
          <motion.div
            key={tarjeta.titulo}
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
            onClick={() => setTarjetaAbierta(tarjeta)}
            className='absolute w-56 bg-white dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-lg transition-colors duration-300 cursor-pointer group'
            style={{
              left: `calc(50% + ${x}px - 7rem)`,
              top: `calc(50% + ${y}px - 4rem)`,
            }}
            whileHover={{ scale: 1.05 }}
          >
            <div className='text-2xl mb-1'>{tarjeta.emoji}</div>
            <h3 className='font-semibold text-slate-900 dark:text-slate-100 group-hover:text-white dark:group-hover:text-slate-900 text-sm mb-1 transition-colors duration-300'>
              {tarjeta.titulo}
            </h3>
            <p className='text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-200 dark:group-hover:text-slate-600 transition-colors duration-300'>
              {tarjeta.descripcion}
            </p>
          </motion.div>
        )
      })}

      <AnimatePresence>
        {tarjetaAbierta && (
          <Modal onClose={() => setTarjetaAbierta(null)}>
            <div className='text-3xl mb-2'>{tarjetaAbierta.emoji}</div>
            <h2 className='text-lg font-bold text-slate-900 dark:text-slate-100 mb-3'>
              {tarjetaAbierta.titulo}
            </h2>
            <p className='text-sm text-slate-600 dark:text-slate-300 leading-relaxed'>
              {tarjetaAbierta.descripcionExtendida}
            </p>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}