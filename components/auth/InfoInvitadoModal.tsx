'use client'

import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { pasosInvitado } from '@/lib/landingContent'
import { ArrowRight, ArrowLeft, ArrowDown, Sparkles } from 'lucide-react'
import { Fragment } from 'react'

interface InfoInvitadoModalProps {
  onClose: () => void
  onConfirmar: () => void
  cargando: boolean
  error: string | null
}

const filas = [
  pasosInvitado.slice(0, 2),
  pasosInvitado.slice(2, 4),
  pasosInvitado.slice(4, 5),
]

export default function InfoInvitadoModal({
  onClose,
  onConfirmar,
  cargando,
  error,
}: InfoInvitadoModalProps) {
  return (
    <Modal onClose={onClose} maxWidth='max-w-5xl' bloqueado={cargando}>
      <h2 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1'>
        ¿Cómo funciona el modo invitado?
      </h2>
      <p className='text-base text-slate-500 dark:text-slate-400 mb-6'>
        Así funciona, paso a paso:
      </p>

      {/* ===== VERSIÓN MÓVIL: flujo vertical simple ===== */}
      <div className='flex md:hidden flex-col'>
        {pasosInvitado.map((paso, i) => (
          <div key={paso.numero}>
            <div className='bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4'>
              <div className='flex items-center gap-2 mb-1'>
                <span className='flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-sm font-bold shrink-0'>
                  {paso.numero}
                </span>
                <h3 className='font-semibold text-slate-900 dark:text-slate-100 text-base'>
                  {paso.titulo}
                </h3>
              </div>
              <p className='text-sm text-slate-500 dark:text-slate-400 pl-9'>
                {paso.descripcion}
              </p>
            </div>
            {i < pasosInvitado.length - 1 && (
              <div className='flex justify-center py-1'>
                <ArrowDown
                  size={20}
                  className='text-blue-400 dark:text-blue-600'
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ===== VERSIÓN DESKTOP: flujo en zigzag ===== */}
      <div className='hidden md:block space-y-3'>
        {filas.map((fila, filaIndex) => {
          const invertida = filaIndex % 2 === 1

          return (
            <div key={filaIndex}>
              <div
                className={`flex items-center gap-4 ${invertida ? 'flex-row-reverse' : ''} ${
                  fila.length === 1
                    ? invertida
                      ? 'justify-end'
                      : 'justify-start'
                    : 'justify-between'
                }`}
              >
                {fila.map((paso, i) => (
                  <Fragment key={paso.numero}>
                    <div className='flex-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-5'>
                      <div className='flex items-center gap-3 mb-2'>
                        <span className='flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white text-sm font-bold shrink-0'>
                          {paso.numero}
                        </span>
                        <h3 className='font-semibold text-slate-900 dark:text-slate-100 text-base'>
                          {paso.titulo}
                        </h3>
                      </div>
                      <p className='text-sm text-slate-500 dark:text-slate-400 pl-11'>
                        {paso.descripcion}
                      </p>
                    </div>
                    {i < fila.length - 1 &&
                      (invertida ? (
                        <ArrowLeft
                          size={24}
                          className='text-blue-400 dark:text-blue-600 shrink-0'
                        />
                      ) : (
                        <ArrowRight
                          size={24}
                          className='text-blue-400 dark:text-blue-600 shrink-0'
                        />
                      ))}
                  </Fragment>
                ))}
              </div>

              {filaIndex < filas.length - 1 && (
                <div
                  className={`flex px-10 py-1 ${filaIndex % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                >
                  <ArrowDown
                    size={24}
                    className='text-blue-400 dark:text-blue-600'
                  />
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
