'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { notaSchema, NotaFormData } from '@/schemas/notaSchema'
import InputField from '@/components/ui/InputField'
import Modal from '@/components/ui/modal/Modal'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { useNotasContext } from '@/context/notas/NotasContext'
import { useState } from 'react'
import axios from 'axios'

export default function NotaForm() {
  const { modal, cerrarModal, guardarNota } = useNotasContext()
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null)

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
      setErrorGuardar(null)
      await guardarNota(data.titulo, data.cuerpo)
    } catch (error) {
      console.error('Error al guardar nota:', error)

      if (axios.isAxiosError(error) && error.response?.data?.mensaje) {
        setErrorGuardar(error.response.data.mensaje)
      } else {
        setErrorGuardar('Ocurrió un error al guardar la nota, intenta de nuevo')
      }
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
          {errorGuardar && (
            <p className='text-red-500 dark:text-red-400 text-sm text-center'>{errorGuardar}</p>
          )}
          <div className='flex flex-col-reverse sm:flex-row gap-3 sm:justify-end'>
            <Button type='button' variant='ghost' onClick={cerrarModal} disabled={cargando} className='w-full sm:w-auto'>
              Cancelar
            </Button>
            <Button type='submit' variant='primary' disabled={cargando} icon={cargando ? <Spinner size={14} /> : undefined} className='w-full sm:w-auto'>
              {cargando ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  )
}