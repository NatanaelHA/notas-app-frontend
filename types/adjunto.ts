export interface PresignedUrlResponse {
    url: string
    adjuntoRuta: string
}

export type EtapaGuardadoNota =
  | 'guardando-nota'
  | 'preparando-imagen'
  | 'subiendo-imagen'
  | 'asociando-imagen'
