'use client'

import { useEffect, useRef } from 'react'
import { RefreshCw, X } from 'lucide-react'
import { formatearTamanoArchivo } from './adjuntoUtils'
import { useRenovarVistaPrevia } from './useRenovarVistaPrevia'

interface VistaPreviaAdjuntoProps {
  archivo?: File
  url?: string
  nombre: string
  tamano?: number
  disabled: boolean
  onCambiar: () => void
  onQuitar?: () => void
  onRenovarUrl?: () => Promise<string>
}

export default function VistaPreviaAdjunto({
  archivo,
  url,
  nombre,
  tamano,
  disabled,
  onCambiar,
  onQuitar,
  onRenovarUrl,
}: VistaPreviaAdjuntoProps) {
  const imagenRef = useRef<HTMLImageElement>(null)
  const vista = useRenovarVistaPrevia(url, archivo ? undefined : onRenovarUrl, disabled)

  // Administra la URL temporal del archivo local y la libera al dejar de utilizarla.
  useEffect(() => {
    if (!archivo) return

    const urlLocal = URL.createObjectURL(archivo)

    if (imagenRef.current) {
      imagenRef.current.src = urlLocal
    }

    return () => URL.revokeObjectURL(urlLocal)
  }, [archivo])

  return (
    <div className='overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60'>
      <div className='relative h-44 w-full bg-slate-100 dark:bg-slate-900'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imagenRef}
          src={archivo ? undefined : vista.url}
          onError={vista.alFallar}
          alt={`Vista previa de ${nombre}`}
          className='h-full w-full object-contain'
        />
        {(vista.error || vista.renovando) && (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-100 p-4 text-center text-sm dark:bg-slate-900' role='status'>
            <p>{vista.renovando ? 'Recargando imagen...' : 'No se pudo cargar la vista previa.'}</p>
            {!archivo && vista.error && !vista.renovando && onRenovarUrl && (
              <button type='button' onClick={vista.reintentar} disabled={disabled} className='text-blue-600 underline disabled:opacity-50 dark:text-blue-400'>
                Reintentar
              </button>
            )}
          </div>
        )}
      </div>

      <div className='flex items-center justify-between gap-3 p-3'>
        <div className='min-w-0'>
          <p className='truncate text-sm font-medium text-slate-700 dark:text-slate-200'>
            {nombre}
          </p>
          {tamano !== undefined && (
            <p className='text-xs text-slate-400'>
              {formatearTamanoArchivo(tamano)}
            </p>
          )}
        </div>

        <div className='flex shrink-0 gap-2'>
          <button
            type='button'
            onClick={onCambiar}
            disabled={disabled}
            className='rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100'
            aria-label='Cambiar imagen'
            title='Cambiar imagen'
          >
            <RefreshCw size={17} />
          </button>
          {onQuitar && (
            <button
              type='button'
              onClick={onQuitar}
              disabled={disabled}
              className='rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/40'
              aria-label='Cancelar cambio de imagen'
              title='Cancelar cambio de imagen'
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
