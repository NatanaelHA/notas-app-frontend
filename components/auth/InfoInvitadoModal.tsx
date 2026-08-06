'use client'

import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { pasosInvitado } from '@/lib/landingContent'
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  LogIn,
  MousePointerClick,
  NotebookPen,
  Sparkles,
  Timer,
  UserRoundPlus,
} from 'lucide-react'
import { Fragment } from 'react'
import { motion, useReducedMotion } from 'motion/react'

interface InfoInvitadoModalProps {
  onClose: () => void
  onConfirmar: () => void
  cargando: boolean
  error: string | null
}

type DireccionFlecha = 'derecha' | 'izquierda' | 'abajo'

const filas = [
  pasosInvitado.slice(0, 2),
  pasosInvitado.slice(2, 4),
  pasosInvitado.slice(4, 5),
]

const iconosPaso = [MousePointerClick, UserRoundPlus, LogIn, NotebookPen, Timer]

function FlechaFlujo({ direccion }: { direccion: DireccionFlecha }) {
  const reducirMovimiento = useReducedMotion()

  const animacion = {
    derecha: { x: [0, 5, 0] },
    izquierda: { x: [0, -5, 0] },
    abajo: { y: [0, 5, 0] },
  }

  const Icono =
    direccion === 'derecha'
      ? ArrowRight
      : direccion === 'izquierda'
        ? ArrowLeft
        : ArrowDown

  return (
    <motion.div
      animate={reducirMovimiento ? undefined : animacion[direccion]}
      transition={{
        duration: 1.6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className='flex shrink-0'
    >
      <Icono
        size={direccion === 'abajo' ? 22 : 24}
        className='text-blue-400 dark:text-blue-600'
      />
    </motion.div>
  )
}

function TarjetaPaso({
  paso,
  indice,
  movil = false,
}: {
  paso: (typeof pasosInvitado)[number]
  indice: number
  movil?: boolean
}) {
  const reducirMovimiento = useReducedMotion()
  const Icono = iconosPaso[paso.numero - 1] ?? Sparkles
  const esUltimoPaso = paso.numero === pasosInvitado.length

  const colorIcono = esUltimoPaso
    ? 'bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white dark:bg-amber-950/60 dark:text-amber-400 dark:group-hover:bg-amber-500'
    : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/60 dark:text-blue-400 dark:group-hover:bg-blue-500'

  const colorBorde = esUltimoPaso
    ? 'hover:border-amber-300 dark:hover:border-amber-700'
    : 'hover:border-blue-300 dark:hover:border-blue-700'

  return (
    <motion.div
      initial={reducirMovimiento ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: reducirMovimiento ? 0 : indice * 0.1,
        ease: 'easeOut',
      }}
      whileHover={
        movil || reducirMovimiento ? undefined : { y: -4, scale: 1.02 }
      }
      whileTap={movil && !reducirMovimiento ? { scale: 0.98 } : undefined}
      className={`group bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors duration-200 ${colorBorde} ${
        movil ? 'p-4' : 'flex-1 p-5'
      }`}
    >
      <div
        className={`flex items-center ${movil ? 'gap-2 mb-1' : 'gap-3 mb-2'}`}
      >
        <span
          className={`flex items-center justify-center rounded-full shrink-0 transition-colors duration-200 ${
            movil ? 'w-7 h-7' : 'w-8 h-8'
          } ${
            esUltimoPaso
              ? 'bg-amber-500 text-white'
              : 'bg-blue-600 dark:bg-blue-500 text-white'
          } ${movil ? 'text-sm' : 'text-sm'} font-bold`}
        >
          {paso.numero}
        </span>

        <span
          className={`flex items-center justify-center rounded-lg shrink-0 transition-colors duration-200 ${
            movil ? 'w-7 h-7' : 'w-9 h-9'
          } ${colorIcono}`}
        >
          <Icono size={movil ? 16 : 20} />
        </span>

        <h3
          className={`font-semibold text-slate-900 dark:text-slate-100 ${
            movil ? 'text-base' : 'text-base'
          }`}
        >
          {paso.titulo}
        </h3>
      </div>

      <p
        className={`text-sm text-slate-500 dark:text-slate-400 ${
          movil ? 'pl-9' : 'pl-20'
        }`}
      >
        {paso.descripcion}
      </p>
    </motion.div>
  )
}

export default function InfoInvitadoModal({
  onClose,
  onConfirmar,
  cargando,
  error,
}: InfoInvitadoModalProps) {
  return (
    <Modal
      onClose={onClose}
      maxWidth='max-w-5xl'
      bloqueado={cargando}
      variant='guest'
      cerrarAlHacerClickAfuera={false}
    >
      <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1'>
        ¿Cómo funciona el modo invitado?
      </h2>

      <p className='text-base text-slate-500 dark:text-slate-400 mb-6'>
        Así funciona, paso a paso:
      </p>

      {/* Móvil: recorrido vertical */}
      <div className='flex md:hidden flex-col'>
        {pasosInvitado.map((paso, indice) => (
          <div key={paso.numero}>
            <TarjetaPaso paso={paso} indice={indice} movil />

            {indice < pasosInvitado.length - 1 && (
              <div className='flex justify-center py-1'>
                <FlechaFlujo direccion='abajo' />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Escritorio: recorrido en zigzag */}
      <div className='hidden md:block space-y-3'>
        {filas.map((fila, filaIndex) => {
          const invertida = filaIndex % 2 === 1

          return (
            <div key={filaIndex}>
              <div
                className={`flex items-center gap-4 ${
                  invertida ? 'flex-row-reverse' : ''
                } ${
                  fila.length === 1
                    ? invertida
                      ? 'justify-end'
                      : 'justify-start'
                    : 'justify-between'
                }`}
              >
                {fila.map((paso, indiceFila) => {
                  const indiceGlobal = filaIndex * 2 + indiceFila

                  return (
                    <Fragment key={paso.numero}>
                      <TarjetaPaso paso={paso} indice={indiceGlobal} />

                      {indiceFila < fila.length - 1 && (
                        <FlechaFlujo
                          direccion={invertida ? 'izquierda' : 'derecha'}
                        />
                      )}
                    </Fragment>
                  )
                })}
              </div>

              {filaIndex < filas.length - 1 && (
                <div
                  className={`flex px-10 py-1 ${
                    filaIndex % 2 === 0 ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <FlechaFlujo direccion='abajo' />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {error && (
        <p className='text-red-500 dark:text-red-400 text-sm text-center mt-4'>
          {error}
        </p>
      )}

      <div className='flex flex-col gap-3 mt-6'>
        <Button
          type='button'
          variant='indigo'
          onClick={onConfirmar}
          disabled={cargando}
          icon={cargando ? <Spinner size={16} /> : <Sparkles size={16} />}
          className='w-full'
        >
          {cargando ? 'Creando cuenta...' : 'Crear mi cuenta de invitado'}
        </Button>

        <Button
          type='button'
          variant='ghost'
          onClick={onClose}
          disabled={cargando}
          className='w-full'
        >
          Cancelar
        </Button>
      </div>
    </Modal>
  )
}
