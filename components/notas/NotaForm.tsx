'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { notaSchema, NotaFormData } from '@/schemas/notaSchema'
import InputField from '@/components/ui/InputField'
import Modal from '@/components/ui/Modal'
import Spinner from '@/components/ui/Spinner'
import { useNotasContext } from '@/context/notas/NotasContext'


export default function NotaForm() {
  const { modal, cerrarModal, guardarNota } = useNotasContext()

  const notaEditando = modal.tipo === 'editar' ? modal.nota : null

  const methods = useForm<NotaFormData>({
    resolver: zodResolver(notaSchema),
    defaultValues: {
      titulo: notaEditando?.titulo ?? '',
      cuerpo: notaEditando?.cuerpo ?? '',
    },
  })

  const { isSubmitting, isDirty } = methods.formState
  const cargando = isSubmitting

  const onSubmit = async (data: NotaFormData) => {
    if (notaEditando && !isDirty) {
      cerrarModal()
      return
    }
    try {
      await guardarNota(data.titulo, data.cuerpo)
    } catch (error) {
      console.error('Error al guardar nota:', error)
    }
  }

  return (
    <Modal onClose={cerrarModal} bloqueado={cargando}>
      <h2 className='text-lg font-bold text-slate-900 dark:text-slate-100 mb-4'>
        {notaEditando ? 'Editar nota' : 'Nueva nota'}
      </h2>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          noValidate
          className='space-y-4'
        >
          <fieldset disabled={cargando} className='space-y-4'>
            <InputField label='Título' name='titulo' type='text' />
            <InputField label='Contenido' name='cuerpo' type='text' />
          </fieldset>
          <div className='flex gap-3 justify-end'>
            <button
              type='button'
              onClick={cerrarModal}
              disabled={cargando}
              className='px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 disabled:hover:text-slate-600 dark:disabled:hover:text-slate-400 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={cargando}
              className='flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:hover:bg-blue-600 dark:disabled:hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {cargando && <Spinner size={14} />}
              {cargando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  )
}