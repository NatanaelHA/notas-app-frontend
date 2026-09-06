export interface Nota {
    noteId: string
    userId: string
    titulo: string
    cuerpo: string
    activo: boolean
    creadoEn: string
    actualizadoEn?: string
    adjuntoRuta?: string
    adjuntoNombre?: string
    adjuntoTipo?: string
    adjuntoTamano?: number
    adjuntoUrl?: string
    desactivadoEn?: string
  }
