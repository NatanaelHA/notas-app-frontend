export const cargarImagenPdf = async (url: string) => {
  const respuesta = await fetch(url)

  if (!respuesta.ok) {
    throw new Error(`No se pudo descargar la imagen (${respuesta.status})`)
  }

  const imagen = await respuesta.arrayBuffer()
  return new Uint8Array(imagen)
}
