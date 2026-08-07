'use client'

import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ModalBorderGlow, ModalHalo } from './ModalGlow'
import ScrollEdgeIndicator from './ScrollEdgeIndicator'
import { useModalGlow, type ModalVariant } from './useModalGlow'
import { useScrollEdgeIndicator } from './useScrollEdgeIndicator'

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
  const { bordeScroll, manejarScroll } = useScrollEdgeIndicator()

  const {
    modalRef,
    fondoBrilloClaro,
    fondoBrilloOscuro,
    fondoHaloClaro,
    opacidadBrillo,
    opacidadHalo,
    manejarMovimiento,
    ocultarBrillo,
    manejarToque,
  } = useModalGlow(variant)

  if (typeof document === 'undefined') return null

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={bloqueado || !cerrarAlHacerClickAfuera ? undefined : onClose}
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
      onPointerMove={manejarMovimiento}
      onPointerLeave={ocultarBrillo}
    >
      <ModalHalo fondoHaloClaro={fondoHaloClaro} opacidadHalo={opacidadHalo} />

      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={manejarToque}
        className={`relative z-10 max-h-[85vh] w-full overflow-hidden rounded-2xl border bg-white shadow-xl dark:bg-slate-800 dark:shadow-black/30 ${
          variant === 'guest'
            ? 'border-blue-200 dark:border-blue-800'
            : 'border-transparent'
        } ${maxWidth}`}
      >
        <ModalBorderGlow
          fondoBrilloClaro={fondoBrilloClaro}
          fondoBrilloOscuro={fondoBrilloOscuro}
          opacidadBrillo={opacidadBrillo}
        />

        <ScrollEdgeIndicator bordeScroll={bordeScroll} />

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
