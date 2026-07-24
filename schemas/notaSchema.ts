import { z } from 'zod'

export const notaSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido').max(100, 'Máximo 100 caracteres'),
  cuerpo: z.string().min(1, 'El contenido es requerido')
})

export type NotaFormData = z.infer<typeof notaSchema>

export const notaDefaultValues: NotaFormData = {
  titulo: '',
  cuerpo: ''
}