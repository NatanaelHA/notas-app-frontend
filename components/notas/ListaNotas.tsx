'use client'

import { useNotasContext } from '@/context/notas/NotasContext'
import NotaForm from '@/components/notas/NotaForm'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { Nota } from '@/types/nota'
import { AnimatePresence, motion } from 'motion/react'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function ListaNotas() {
  const {
    notas,
    modal,
    notaAEliminar,
    abrirModalCrear,
    abrirModalEditar,
    pedirConfirmacionEliminar,
    cancelarEliminar,
    confirmarEliminar,
  } = useNotasContext()

  const [botonHoverId, setBotonHoverId] = useState<string | null>(null)
  const [eliminando, setEliminando] = useState(false)

  const handleClickEliminar = (e: React.MouseEvent, nota: Nota) => {
    e.stopPropagation()
    pedirConfirmacionEliminar(nota)
  }

  const handleConfirmarEliminar = async () => {
    setEliminando(true)
    await confirmarEliminar()
    setEliminando(false)
  }

  return (
    <>
      <div className='flex justify-end mb-6'>
        <Button
          onClick={abrirModalCrear}
          icon={<Plus size={18} />}
          variant='indigo'
          className='w-full sm:w-auto'
        >
          Nueva nota
        </Button>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {notas.map((nota) => {
          const botonActivo = botonHoverId === nota.noteId

          return (
            <motion.div
              key={nota.noteId}
              whileHover={botonActivo ? {} : { y: -4, rotate: -1, scale: 1.02 }}
              animate={botonActivo ? { y: 0, rotate: 0, scale: 1 } : undefined}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className='bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 p-4 shadow-sm hover:shadow-lg dark:shadow-none dark:hover:shadow-black/30 transition-shadow cursor-pointer relative'
              onClick={() => abrirModalEditar(nota)}
            >
              <motion.button
                onClick={(e) => handleClickEliminar(e, nota)}
                onMouseEnter={() => setBotonHoverId(nota.noteId)}
                onMouseLeave={() => setBotonHoverId(null)}
                whileHover={{ scale: 1.25 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className='absolute top-3 right-3 p-2 rounded-full text-red-500 dark:text-red-400 bg-white/80 dark:bg-slate-800/80 sm:bg-transparent sm:dark:bg-transparent hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors'
              >
                <Trash2 size={16} />
              </motion.button>
              <h2 className='font-semibold text-slate-900 dark:text-slate-100 mb-2 pr-6'>
                {nota.titulo}
              </h2>
              <p className='text-slate-600 dark:text-slate-300 text-sm'>
                {nota.cuerpo}
              </p>
              <span className='text-xs text-slate-400 dark:text-slate-500 mt-3 block'>
                {nota.actualizadoEn ? 'Editado: ' : 'Creado: '}
                {new Date(
                  nota.actualizadoEn ?? nota.creadoEn,
                ).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {modal.tipo !== 'cerrado' && <NotaForm />}
        {notaAEliminar && (
          <ConfirmDialog
            titulo='Eliminar nota'
            mensaje={`¿Seguro que quieres eliminar "${notaAEliminar.titulo}"?`}
            onCancelar={cancelarEliminar}
            acciones={[
              {
                label: eliminando ? 'Eliminando...' : 'Eliminar',
                icono: eliminando ? <Spinner size={14} /> : undefined,
                disabled: eliminando,
                onClick: handleConfirmarEliminar,
                variant: 'danger',
              },
            ]}
          />
        )}
      </AnimatePresence>
    </>
  )
}
