'use client'

import { ChangeEvent, useRef, useState } from 'react'
import { ImagePlus } from 'lucide-react'
import VistaPreviaAdjunto from './VistaPreviaAdjunto'
import { ACCEPT_ADJUNTO, validarArchivoAdjunto } from './adjuntoUtils'

interface SelectorAdjuntoProps {
  archivo: File | null
  adjuntoActual?: {
    url: string
    nombre: string
    tamano?: number
  }
  disabled?: boolean
  onChange: (archivo: File | null) => void
  onRenovarUrl?: () => Promise<string>
}

export default function SelectorAdjunto({
  archivo,
  adjuntoActual,
  disabled = false,
  onChange,
  onRenovarUrl,
}: SelectorAdjuntoProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const abrirSelector = () => {
    inputRef.current?.click()
  }

  const seleccionarArchivo = (event: ChangeEvent<HTMLInputElement>) => {
    const archivoSeleccionado = event.target.files?.[0]

    if (!archivoSeleccionado) return

    const errorValidacion = validarArchivoAdjunto(archivoSeleccionado)

    if (errorValidacion) {
      setError(errorValidacion)
      event.target.value = ''
      return
    }

    setError(null)
    onChange(archivoSeleccionado)
  }

  const quitarSeleccion = () => {
    setError(null)
    onChange(null)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between gap-3'>
        <label className='text-sm font-medium text-slate-700 dark:text-slate-200'>
          Imagen adjunta <span className='font-normal text-slate-400'>(opcional)</span>
        </label>
        <span className='text-xs text-slate-400'>JPEG, PNG o WebP · máx. 5 MB</span>
      </div>

      <input
        ref={inputRef}
        type='file'
        accept={ACCEPT_ADJUNTO}
        onChange={seleccionarArchivo}
        disabled={disabled}
        className='sr-only'
      />

      {archivo || adjuntoActual ? (
        <VistaPreviaAdjunto
          key={archivo ? `local-${archivo.name}-${archivo.lastModified}` : `remoto-${adjuntoActual?.url}`}
          archivo={archivo ?? undefined}
          url={archivo ? undefined : adjuntoActual?.url}
          nombre={archivo?.name ?? adjuntoActual?.nombre ?? 'Imagen adjunta'}
          tamano={archivo?.size ?? adjuntoActual?.tamano}
          disabled={disabled}
          onCambiar={abrirSelector}
          onQuitar={archivo ? quitarSeleccion : undefined}
          onRenovarUrl={onRenovarUrl}
        />
      ) : (
        <button
          type='button'
          onClick={abrirSelector}
          disabled={disabled}
          className='flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-7 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/60 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:hover:border-blue-500 dark:hover:bg-blue-950/20'
        >
          <ImagePlus size={25} className='text-blue-500' />
          <span className='text-sm font-medium text-slate-700 dark:text-slate-200'>
            Seleccionar una imagen
          </span>
          <span className='text-xs text-slate-400'>
            Se mostrará una vista previa antes de guardar
          </span>
        </button>
      )}

      {error && (
        <p role='alert' className='text-sm text-red-500 dark:text-red-400'>
          {error}
        </p>
      )}
    </div>
  )
}
