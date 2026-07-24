import { useState } from 'react'
import { toast } from 'sonner'
import { Nota } from '@/types/nota'
import {
  crearNota as crearNotaAPI,
  actualizarNota as actualizarNotaAPI,
  desactivarNota as desactivarNotaAPI,
} from '@/services/notasService'

export type ModalEstado =
  | { tipo: 'cerrado' }
  | { tipo: 'crear' }
  | { tipo: 'editar'; nota: Nota }

export function useNotasState(notasIniciales: Nota[]) {
  const [notas, setNotas] = useState<Nota[]>(notasIniciales)
  const [modal, setModal] = useState<ModalEstado>({ tipo: 'cerrado' })
  const [notaAEliminar, setNotaAEliminar] = useState<Nota | null>(null)

  const abrirModalCrear = () => setModal({ tipo: 'crear' })
  const abrirModalEditar = (nota: Nota) => setModal({ tipo: 'editar', nota })
  const cerrarModal = () => setModal({ tipo: 'cerrado' })

  const guardarNota = async (titulo: string, cuerpo: string) => {
    if (modal.tipo === 'cerrado') return

    if (modal.tipo === 'editar') {
      const nota = await actualizarNotaAPI(modal.nota.noteId, titulo, cuerpo)
      setNotas(notas.map((n) => (n.noteId === nota.noteId ? nota : n)))
      toast.success('Nota actualizada')
    } else {
      const nota = await crearNotaAPI(titulo, cuerpo)
      setNotas([nota, ...notas])
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
