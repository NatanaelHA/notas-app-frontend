import axios from 'axios'
import type { Nota } from '@/types/nota'
import type { EtapaGuardadoNota } from '@/types/adjunto'
import { obtenerUrlSubida, subirAdjuntoAS3, asociarAdjunto } from '../notasService'

// Conserva subidas confirmadas mientras se mantiene el mismo archivo en memoria.
const adjuntosPendientes = new WeakMap<File, Map<string, string>>()

// Si falla la asociación, el reintento reutiliza la imagen ya subida a S3.
export const subirYAsociarAdjunto = async (
  noteId: string,
  archivo: File,
  onEtapa?: (etapa: EtapaGuardadoNota) => void,
): Promise<Nota> => {
  let pendientes = adjuntosPendientes.get(archivo)
  let adjuntoRuta = pendientes?.get(noteId)

  if (!adjuntoRuta) {
    onEtapa?.('preparando-imagen')
    const subida = await obtenerUrlSubida(noteId, archivo)

    onEtapa?.('subiendo-imagen')
    await subirAdjuntoAS3(subida.url, archivo)

    adjuntoRuta = subida.adjuntoRuta
    if (!pendientes) {
      pendientes = new Map()
      adjuntosPendientes.set(archivo, pendientes)
    }
    pendientes.set(noteId, adjuntoRuta)
  }

  onEtapa?.('asociando-imagen')
  try {
    const nota = await asociarAdjunto(noteId, adjuntoRuta, archivo.name)
    pendientes?.delete(noteId)
    return nota
  } catch (error) {
    // Estos errores confirman que S3 ya no conserva una imagen válida para reintentar.
    if (axios.isAxiosError(error)) {
      const mensaje = error.response?.data?.mensaje
      if (
        (error.response?.status === 404 && mensaje === 'Imagen no encontrada en S3') ||
        (error.response?.status === 400 && mensaje === 'La imagen subida no cumple el tipo o tamaño permitido')
      ) {
        pendientes?.delete(noteId)
      }
    }
    throw error
  }
}
