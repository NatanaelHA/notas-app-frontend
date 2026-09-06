'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { notaSchema, NotaFormData } from '@/schemas/notaSchema'
import InputField from '@/components/ui/InputField'
import Modal from '@/components/ui/modal/Modal'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import SelectorAdjunto from '@/components/notas/adjuntos/SelectorAdjunto'
import { useNotasContext } from '@/context/notas/NotasContext'
import { EtapaGuardadoNota } from '@/types/adjunto'
import { useState } from 'react'
import axios from 'axios'
import { obtenerNotas } from '@/services/notasService'

const TEXTO_ETAPA: Record<EtapaGuardadoNota, string> = {
  'guardando-nota': 'Guardando nota...',
  'preparando-imagen': 'Preparando imagen...',
  'subiendo-imagen': 'Subiendo imagen...',
  'asociando-imagen': 'Asociando imagen...',
}

export default function NotaForm() {
  const { modal, cerrarModal, guardarNota } = useNotasContext()
  const [errorGuardar, setErrorGuardar] = useState<string | null>(null)
  const [archivoAdjunto, setArchivoAdjunto] = useState<File | null>(null)
  const [etapaGuardado, setEtapaGuardado] = useState<EtapaGuardadoNota | null>(null)

  const notaEditando = modal.tipo === 'editar' ? modal.nota : null

  const methods = useForm<NotaFormData>({
    resolver: zodResolver(notaSchema),
    defaultValues: {
      titulo: notaEditando?.titulo ?? '',
      cuerpo: notaEditando?.cuerpo ?? '',
    },
  })

  const { isSubmitting } = methods.formState
  const cargando = isSubmitting

  const renovarUrlAdjunto = async () => {
    const notasActuales = await obtenerNotas()
    const notaActual = notasActuales.find((nota) => nota.noteId === notaEditando?.noteId)
    if (!notaActual?.adjuntoUrl) throw new Error('La imagen ya no está disponible')
    return notaActual.adjuntoUrl
  }

  const onSubmit = async (data: NotaFormData) => {
    try {
      setErrorGuardar(null)
      await guardarNota(
        data.titulo,
        data.cuerpo,
        archivoAdjunto,
        setEtapaGuardado,
      )
    } catch (error) {
      console.error('Error al guardar nota:', error)

      if (axios.isAxiosError(error) && error.response?.data?.mensaje) {
        setErrorGuardar(error.response.data.mensaje)
      } else {
        setErrorGuardar('Ocurrió un error al guardar la nota, intenta de nuevo')
      }
    } finally {
      setEtapaGuardado(null)
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
            <SelectorAdjunto
              archivo={archivoAdjunto}
              adjuntoActual={
                notaEditando?.adjuntoUrl
                  ? {
                      url: notaEditando.adjuntoUrl,
                      nombre: notaEditando.adjuntoNombre ?? 'Imagen adjunta',
                      tamano: notaEditando.adjuntoTamano,
                    }
                  : undefined
              }
              disabled={cargando}
              onChange={setArchivoAdjunto}
              onRenovarUrl={notaEditando ? renovarUrlAdjunto : undefined}
            />
          </fieldset>
          {errorGuardar && (
            <p className='text-red-500 dark:text-red-400 text-sm text-center'>{errorGuardar}</p>
          )}
          <div className='flex flex-col-reverse sm:flex-row gap-3 sm:justify-end'>
            <Button type='button' variant='ghost' onClick={cerrarModal} disabled={cargando} className='w-full sm:w-auto'>
              Cancelar
            </Button>
            <Button type='submit' variant='primary' disabled={cargando} icon={cargando ? <Spinner size={14} /> : undefined} className='w-full sm:w-auto'>
              {cargando
                ? etapaGuardado
                  ? TEXTO_ETAPA[etapaGuardado]
                  : 'Guardando...'
                : 'Guardar'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  )
}
