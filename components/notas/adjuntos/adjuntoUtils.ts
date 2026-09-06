export const TIPOS_ADJUNTO_PERMITIDOS = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

export const ACCEPT_ADJUNTO = TIPOS_ADJUNTO_PERMITIDOS.join(',')

const TAMANO_MAXIMO_ADJUNTO = 5 * 1024 * 1024

export const validarArchivoAdjunto = (archivo: File) => {
  if (!TIPOS_ADJUNTO_PERMITIDOS.includes(archivo.type)) {
    return 'Selecciona una imagen JPEG, PNG o WebP'
  }

  if (archivo.size <= 0) {
    return 'La imagen seleccionada está vacía'
  }

  if (archivo.size > TAMANO_MAXIMO_ADJUNTO) {
    return 'La imagen no puede superar los 5 MB'
  }

  return null
}

export const formatearTamanoArchivo = (bytes: number) => {
  const megabytes = bytes / (1024 * 1024)

  if (megabytes >= 1) {
    return `${megabytes.toFixed(1)} MB`
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}
