'use client'

import Modal from '@/components/ui/modal/Modal'
import Button, { ButtonVariant } from '@/components/ui/Button'
import { ReactNode } from 'react'

interface ConfirmDialogAction {
  label: string
  onClick: () => void
  variant: ButtonVariant
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
        <Button variant='ghost' onClick={onCancelar} disabled={cargando}>
          Cancelar
        </Button>
        {acciones.map((accion, i) => (
          <Button
            key={i}
            variant={accion.variant}
            onClick={accion.onClick}
            disabled={accion.disabled}
            icon={accion.icono}
          >
            {accion.label}
          </Button>
        ))}
      </div>
    </Modal>
  )
}
