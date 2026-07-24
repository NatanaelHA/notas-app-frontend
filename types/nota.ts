export interface Nota {
    noteId: string
    userId: string
    titulo: string
    cuerpo: string
    activo: boolean
    creadoEn: string
    actualizadoEn?: string
    adjuntoKey?: string
    adjuntoUrl?: string
    desactivadoEn?: string
  }