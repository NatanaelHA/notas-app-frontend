'use client'

import { motion } from 'motion/react'
import { ReactNode } from 'react'

interface ModalProps {
  children: ReactNode
  onClose: () => void
  maxWidth?: string
  bloqueado?: boolean
}

export default function Modal({ children, onClose, maxWidth = 'max-w-md', bloqueado = false }: ModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={bloqueado ? undefined : onClose}
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        onClick={(e) => e.stopPropagation()}
        className={`bg-white dark:bg-slate-800 rounded-2xl p-6 w-full ${maxWidth} shadow-xl dark:shadow-black/30`}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}