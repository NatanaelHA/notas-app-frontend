import { useState } from 'react'
import { toast } from 'sonner'
import { Nota } from '@/types/nota'
import { EtapaGuardadoNota } from '@/types/adjunto'
import {
  crearNota as crearNotaAPI,
  actualizarNota as actualizarNotaAPI,
  desactivarNota as desactivarNotaAPI,
} from '@/services/notasService'
import { subirYAsociarAdjunto } from '@/services/adjuntos/guardarAdjunto'

export type ModalEstado =
  | { tipo: 'cerrado' }
  | { tipo: 'crear' }
  | { tipo: 'editar'; nota: Nota }

export function useNotasState(notasIniciales: Nota[]) {
  const [notas, setNotas] = useState<Nota[]>(notasIniciales)
  const [modal, setModal] = useState<ModalEstado>({ tipo: 'cerrado' })
  const [notaAEliminar, setNotaAEliminar] = useState<Nota | null>(null)
  const [notaCreadaPendiente, setNotaCreadaPendiente] = useState<Nota | null>(null)

  const abrirModalCrear = () => {
    setNotaCreadaPendiente(null)
    setModal({ tipo: 'crear' })
  }

  const abrirModalEditar = (nota: Nota) => {
    setNotaCreadaPendiente(null)
    setModal({ tipo: 'editar', nota })
  }

  const cerrarModal = () => {
    setNotaCreadaPendiente(null)
    setModal({ tipo: 'cerrado' })
  }

  const reemplazarNota = (notaActualizada: Nota) => {
    setNotas((notasActuales) =>
      notasActuales.map((notaActual) =>
        notaActual.noteId === notaActualizada.noteId
          ? notaActualizada
          : notaActual,
      ),
    )
  }

  const guardarNota = async (
    titulo: string,
    cuerpo: string,
    archivoAdjunto: File | null,
    onEtapa?: (etapa: EtapaGuardadoNota) => void,
  ) => {
    if (modal.tipo === 'cerrado') return

    if (modal.tipo === 'editar') {
      // Compara con lo ya guardado, aunque la subida de imagen anterior haya fallado.
      let nota = notas.find((actual) => actual.noteId === modal.nota.noteId) ?? modal.nota
      const textoModificado = nota.titulo !== titulo || nota.cuerpo !== cuerpo

      if (!textoModificado && !archivoAdjunto) {
        cerrarModal()
        return
      }

      if (textoModificado) {
        onEtapa?.('guardando-nota')
        nota = await actualizarNotaAPI(nota.noteId, titulo, cuerpo)
        reemplazarNota(nota)
      }

      if (archivoAdjunto) {
        nota = await subirYAsociarAdjunto(nota.noteId, archivoAdjunto, onEtapa)
        reemplazarNota(nota)
      }

      toast.success('Nota actualizada')
    } else {
      let nota = notaCreadaPendiente

      if (!nota) {
        onEtapa?.('guardando-nota')
        const notaCreada = await crearNotaAPI(titulo, cuerpo)
        nota = notaCreada
        setNotas((notasActuales) => [notaCreada, ...notasActuales])

        if (archivoAdjunto) {
          setNotaCreadaPendiente(notaCreada)
        }
      } else if (nota.titulo !== titulo || nota.cuerpo !== cuerpo) {
        onEtapa?.('guardando-nota')
        nota = await actualizarNotaAPI(nota.noteId, titulo, cuerpo)
        setNotaCreadaPendiente(nota)
        reemplazarNota(nota)
      }

      if (archivoAdjunto) {
        const notaConAdjunto = await subirYAsociarAdjunto(
          nota.noteId,
          archivoAdjunto,
          onEtapa,
        )
        nota = notaConAdjunto
        reemplazarNota(notaConAdjunto)
      }

      toast.success('Nota creada')
    }
    cerrarModal()
  }

  const pedirConfirmacionEliminar = (nota: Nota) => setNotaAEliminar(nota)
  const cancelarEliminar = () => setNotaAEliminar(null)

  const confirmarEliminar = async () => {
    if (!notaAEliminar) return
    await desactivarNotaAPI(notaAEliminar.noteId)
    setNotas(notas.filter((n) => n.noteId !== notaAEliminar.noteId))
    toast.success('Nota eliminada')
    setNotaAEliminar(null)
  }

  return {
    notas,
    modal,
    notaAEliminar,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    guardarNota,
    pedirConfirmacionEliminar,
    cancelarEliminar,
    confirmarEliminar,
  }
}
