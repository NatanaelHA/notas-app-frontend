'use client'

import Modal from '@/components/ui/Modal'
import { ReactNode } from 'react'

interface ConfirmDialogAction {
  label: string
  onClick: () => void
  className: string
  icono?: ReactNode
  disabled?: boolean
}

interface ConfirmDialogProps {
  titulo: string
  mensaje: string
  onCancelar: () => void
  acciones: ConfirmDialogAction[]
}

export default function ConfirmDialog({
  titulo,
  mensaje,
  onCancelar,
  acciones,
}: ConfirmDialogProps) {
  const cargando = acciones.some((accion) => accion.disabled)

  return (
    <Modal onClose={onCancelar} maxWidth='max-w-sm' bloqueado={cargando}>
      <h2 className='text-lg font-bold text-slate-900 dark:text-slate-100 mb-2'>
        {titulo}
      </h2>
      <p className='text-slate-600 dark:text-slate-400 text-sm mb-6'>
        {mensaje}
      </p>
      <div className='flex gap-3 justify-end'>
        <button
          onClick={onCancelar}
          disabled={cargando}
          className='px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 disabled:hover:text-slate-600 dark:disabled:hover:text-slate-400 transition disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Cancelar
        </button>
        {acciones.map((accion, i) => (
          <button
            key={i}
            onClick={accion.onClick}
            disabled={accion.disabled}
            className={`flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${accion.className}`}
          >
            {accion.icono}
            {accion.label}
          </button>
        ))}
      </div>
    </Modal>
  )
}
