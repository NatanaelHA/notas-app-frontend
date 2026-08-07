'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { tarjetasLanding, TarjetaLanding } from '@/lib/landingContent'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/modal/Modal'
import Spinner from '@/components/ui/Spinner'
import { LogIn } from 'lucide-react'
import TextoResaltado from '@/components/ui/TextoResaltado'

const RADIO = 460

export default function RuedaFortuna() {
  const router = useRouter()
  const [pausado, setPausado] = useState(false)
  const [tarjetaAbierta, setTarjetaAbierta] = useState<TarjetaLanding | null>(
    null,
  )
  const [navegando, setNavegando] = useState(false)

  const handleIrALogin = () => {
    setNavegando(true)
    router.push('/login')
  }

  return (
    <>
      {/* ===== VERSIÓN MÓVIL: lista vertical simple ===== */}
      <div
        className={`flex md:hidden flex-col items-center gap-6 w-full max-w-sm transition-opacity ${navegando ? 'pointer-events-none opacity-60' : ''}`}
      >
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2'>
            Notas App
          </h1>
          <p className='text-sm text-slate-500 dark:text-slate-400'>
            Un proyecto full-stack sobre AWS
          </p>
        </div>

        <Button
          variant='indigo'
          icon={navegando ? <Spinner size={20} /> : <LogIn size={20} />}
          onClick={handleIrALogin}
          disabled={navegando}
          className='w-full py-4 text-base'
        >
          {navegando ? 'Cargando...' : 'Probar la app'}
        </Button>

        <div className='w-full space-y-3'>
          {tarjetasLanding.map((tarjeta) => {
            const Icono = tarjeta.icono
            return (
              <button
                key={tarjeta.titulo}
                onClick={() => setTarjetaAbierta(tarjeta)}
                className='w-full text-left bg-white dark:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm transition-colors'
              >
                <div className='flex items-start gap-3'>
                  <Icono
                    size={24}
                    className='text-blue-600 dark:text-blue-400 shrink-0'
                  />
                  <div>
                    <h3 className='font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1'>
                      {tarjeta.titulo}
                    </h3>
                    <TextoResaltado
                      texto={tarjeta.descripcion}
                      className='text-xs text-slate-600 dark:text-slate-400'
                    />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ===== VERSIÓN DESKTOP: rueda de la fortuna ===== */}
      <div
        className={`hidden md:flex relative w-full h-325 items-center justify-center transition-opacity ${
          navegando ? 'pointer-events-none opacity-60' : ''
        }`}
      >
        <motion.div
          className='absolute rounded-full border-2 border-dashed border-blue-300 dark:border-blue-800'
          style={{ width: RADIO * 2 + 100, height: RADIO * 2 + 100 }}
          animate={pausado ? {} : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />

        <div className='z-10'>
          <Button
            variant='indigo'
            icon={navegando ? <Spinner size={22} /> : <LogIn size={22} />}
            onClick={handleIrALogin}
            disabled={navegando}
            className='px-12 py-6 text-xl'
          >
            {navegando ? 'Cargando...' : 'Probar la app'}
          </Button>
        </div>

        {tarjetasLanding.map((tarjeta, i) => {
          const Icono = tarjeta.icono
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
              className='absolute w-96 bg-white dark:bg-slate-800 hover:bg-slate-900 dark:hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl p-7 shadow-lg transition-colors duration-300 cursor-pointer group'
              style={{
                left: `calc(50% + ${x}px - 12rem)`,
                top: `calc(50% + ${y}px - 7rem)`,
              }}
              whileHover={{ scale: 1.05 }}
            >
              <Icono
                size={40}
                className='text-blue-600 dark:text-blue-400 group-hover:text-blue-300 dark:group-hover:text-blue-700 mb-3 transition-colors duration-300'
              />
              <h3 className='font-semibold text-slate-900 dark:text-slate-100 group-hover:text-white dark:group-hover:text-slate-900 text-xl mb-2 transition-colors duration-300'>
                {tarjeta.titulo}
              </h3>
              <TextoResaltado
                texto={tarjeta.descripcion}
                className='text-base text-slate-600 dark:text-slate-400 group-hover:text-slate-200 dark:group-hover:text-slate-600 transition-colors duration-300'
                strongClassName='group-hover:text-blue-300 dark:group-hover:text-blue-700'
              />
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {tarjetaAbierta && (
          <Modal onClose={() => setTarjetaAbierta(null)} maxWidth='max-w-xl'>
            <tarjetaAbierta.icono
              size={48}
              className='text-blue-600 dark:text-blue-400 mb-4'
            />
            <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4'>
              {tarjetaAbierta.titulo}
            </h2>
            <TextoResaltado
              texto={tarjetaAbierta.descripcionExtendida}
              className='text-lg text-slate-600 dark:text-slate-300 leading-relaxed'
            />
          </Modal>
        )}
      </AnimatePresence>
    </>
  )
}
