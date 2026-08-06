'use client'

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type ModalVariant = 'default' | 'guest'

type BordeScroll = 'arriba' | 'abajo' | null

interface ModalProps {
  children: ReactNode
  onClose: () => void
  maxWidth?: string
  bloqueado?: boolean
  variant?: ModalVariant
  cerrarAlHacerClickAfuera?: boolean
}

export default function Modal({
  children,
  onClose,
  maxWidth = 'max-w-md',
  bloqueado = false,
  variant = 'default',
  cerrarAlHacerClickAfuera = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  const temporizadorBrilloRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  const [bordeScroll, setBordeScroll] = useState<BordeScroll>(null)

  const ultimoBordeScrollRef = useRef<BordeScroll>(null)
  const yaSeDesplazoRef = useRef(false)

  const temporizadorIndicadorRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  const reducirMovimiento = useReducedMotion()

  const brilloXObjetivo = useMotionValue(0)
  const brilloYObjetivo = useMotionValue(0)
  const opacidadBrilloObjetivo = useMotionValue(0)

  const brilloX = useSpring(brilloXObjetivo, {
    stiffness: 260,
    damping: 28,
  })

  const brilloY = useSpring(brilloYObjetivo, {
    stiffness: 260,
    damping: 28,
  })

  const opacidadBrillo = useSpring(opacidadBrilloObjetivo, {
    stiffness: 180,
    damping: 24,
  })

  const configuracionBrillo =
    variant === 'guest'
      ? {
          radio: 190,
          centro: 'rgba(219, 234, 254, 1)',
          azulClaro: 'rgba(96, 165, 250, 0.7)',
          azulProfundo: 'rgba(59, 130, 246, 0.35)',
        }
      : {
          radio: 150,
          centro: 'rgba(219, 234, 254, 0.8)',
          azulClaro: 'rgba(96, 165, 250, 0.45)',
          azulProfundo: 'rgba(59, 130, 246, 0.2)',
        }

  const fondoBrillo = useMotionTemplate`
  radial-gradient(
    ${configuracionBrillo.radio}px circle at ${brilloX}px ${brilloY}px,
    ${configuracionBrillo.centro},
    ${configuracionBrillo.azulClaro} 35%,
    ${configuracionBrillo.azulProfundo} 58%,
    transparent 78%
    )
  `

  const manejarMovimiento = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducirMovimiento || e.pointerType !== 'mouse' || !modalRef.current) {
      return
    }

    const rect = modalRef.current.getBoundingClientRect()

    const cursorDentroDelModal =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom

    if (cursorDentroDelModal) {
      opacidadBrilloObjetivo.set(0)
      return
    }

    const posicionX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width)

    const posicionY = Math.min(Math.max(e.clientY - rect.top, 0), rect.height)

    brilloXObjetivo.set(posicionX)
    brilloYObjetivo.set(posicionY)
    opacidadBrilloObjetivo.set(1)
  }

  const ocultarBrillo = () => {
    opacidadBrilloObjetivo.set(0)
  }

  const manejarToque = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducirMovimiento || e.pointerType !== 'touch' || !modalRef.current) {
      return
    }

    const rect = modalRef.current.getBoundingClientRect()

    const posicionX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width)

    const posicionY = Math.min(Math.max(e.clientY - rect.top, 0), rect.height)

    const distancias = {
      izquierda: posicionX,
      derecha: rect.width - posicionX,
      arriba: posicionY,
      abajo: rect.height - posicionY,
    }

    const distanciaMinima = Math.min(...Object.values(distancias))

    if (distanciaMinima === distancias.izquierda) {
      brilloXObjetivo.set(0)
      brilloYObjetivo.set(posicionY)
    } else if (distanciaMinima === distancias.derecha) {
      brilloXObjetivo.set(rect.width)
      brilloYObjetivo.set(posicionY)
    } else if (distanciaMinima === distancias.arriba) {
      brilloXObjetivo.set(posicionX)
      brilloYObjetivo.set(0)
    } else {
      brilloXObjetivo.set(posicionX)
      brilloYObjetivo.set(rect.height)
    }

    opacidadBrilloObjetivo.set(1)

    if (temporizadorBrilloRef.current) {
      clearTimeout(temporizadorBrilloRef.current)
    }

    temporizadorBrilloRef.current = setTimeout(() => {
      opacidadBrilloObjetivo.set(0)
    }, 650)
  }

  const manejarScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const contenedor = e.currentTarget

    const tieneScroll = contenedor.scrollHeight > contenedor.clientHeight + 1

    if (!tieneScroll) return

    const estaArriba = contenedor.scrollTop <= 2
    const estaAbajo =
      contenedor.scrollTop + contenedor.clientHeight >=
      contenedor.scrollHeight - 2

    if (contenedor.scrollTop > 8) {
      yaSeDesplazoRef.current = true
    }

    const bordeActual: BordeScroll = estaArriba
      ? 'arriba'
      : estaAbajo
        ? 'abajo'
        : null

    if (
      bordeActual === null ||
      (bordeActual === 'arriba' && !yaSeDesplazoRef.current)
    ) {
      ultimoBordeScrollRef.current = null
      return
    }

    if (ultimoBordeScrollRef.current === bordeActual) return

    ultimoBordeScrollRef.current = bordeActual
    setBordeScroll(bordeActual)

    if (temporizadorIndicadorRef.current) {
      clearTimeout(temporizadorIndicadorRef.current)
    }

    temporizadorIndicadorRef.current = setTimeout(() => {
      setBordeScroll(null)
    }, 900)
  }

  useEffect(() => {
    return () => {
      if (temporizadorBrilloRef.current) {
        clearTimeout(temporizadorBrilloRef.current)
      }

      if (temporizadorIndicadorRef.current) {
        clearTimeout(temporizadorIndicadorRef.current)
      }
    }
  }, [])

  if (typeof document === 'undefined') return null

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={bloqueado || !cerrarAlHacerClickAfuera ? undefined : onClose}
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'
      onPointerMove={manejarMovimiento}
      onPointerLeave={ocultarBrillo}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white dark:bg-slate-800 rounded-2xl w-full ${maxWidth} max-h-[85vh] overflow-hidden shadow-xl dark:shadow-black/30 border ${
          variant === 'guest'
            ? 'border-blue-200 dark:border-blue-800'
            : 'border-transparent'
        }`}
        ref={modalRef}
        onPointerDown={manejarToque}
      >
        <motion.div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 z-0 rounded-2xl p-px'
          style={{
            background: fondoBrillo,
            opacity: opacidadBrillo,
          }}
        >
          <div className='h-full w-full rounded-[15px] bg-white dark:bg-slate-800' />
        </motion.div>

        <AnimatePresence>
          {!reducirMovimiento && bordeScroll && (
            <motion.div
              key={bordeScroll}
              initial={{
                opacity: 0,
                y: bordeScroll === 'arriba' ? -12 : 12,
                scale: 0.65,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: bordeScroll === 'arriba' ? -8 : 8,
                scale: 0.85,
              }}
              transition={{
                duration: 0.35,
                ease: 'easeOut',
              }}
              className={`pointer-events-none absolute inset-x-0 z-20 flex justify-center ${
                bordeScroll === 'arriba' ? 'top-1' : 'bottom-1'
              }`}
            >
              <motion.div
                aria-hidden='true'
                initial={{ opacity: 0, scaleY: 0.15 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0.5 }}
                transition={{
                  duration: 0.45,
                  delay: 0.05,
                  ease: 'easeOut',
                }}
                className={`absolute inset-x-0 z-0 ${
                  bordeScroll === 'arriba'
                    ? 'top-[-0.25rem] h-16 origin-top bg-gradient-to-b from-sky-400/40 via-sky-300/15 to-transparent dark:from-sky-700/35 dark:via-sky-800/15'
                    : 'bottom-[-0.25rem] h-16 origin-bottom bg-gradient-to-t from-indigo-500/40 via-violet-400/15 to-transparent dark:from-indigo-700/35 dark:via-violet-800/15'
                }`}
                style={{
                  clipPath:
                    bordeScroll === 'arriba'
                      ? 'polygon(0 0, 100% 0, 62% 100%, 38% 100%)'
                      : 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)',
                }}
              />

              <motion.span
                initial={{
                  clipPath:
                    bordeScroll === 'arriba'
                      ? 'inset(100% 0 0 0)'
                      : 'inset(0 0 100% 0)',
                }}
                animate={{ clipPath: 'inset(0 0 0 0)' }}
                transition={{
                  duration: 0.3,
                  delay: 0.12,
                  ease: 'easeOut',
                }}
                className={`relative z-10 text-4xl font-black leading-none ${
                  bordeScroll === 'arriba'
                    ? 'text-sky-500/65 dark:text-sky-500/55'
                    : 'text-indigo-500/65 dark:text-indigo-500/55'
                }`}
              >
                N
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className='relative z-10 max-h-[calc(85vh-2px)] overflow-y-auto p-6'
          onScroll={manejarScroll}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
