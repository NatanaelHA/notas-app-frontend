import type { Nota } from '@/types/nota'

const formatearFecha = (fecha: string) =>
  new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(new Date(fecha))

export async function descargarNotasPdf(notas: Nota[]) {
  const { jsPDF } = await import('jspdf')
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
  const anchoPagina = pdf.internal.pageSize.getWidth()
  const altoPagina = pdf.internal.pageSize.getHeight()
  const margen = 18
  const anchoContenido = anchoPagina - margen * 2
  const limiteInferior = altoPagina - 20
  let posicionY = 20

  const agregarPaginaSiEsNecesario = (altoNecesario: number) => {
    if (posicionY + altoNecesario <= limiteInferior) return

    pdf.addPage()
    posicionY = 20
  }

  const escribirLineas = (
    lineas: string[],
    opciones: { altoLinea?: number; sangria?: number } = {},
  ) => {
    const altoLinea = opciones.altoLinea ?? 5
    const sangria = opciones.sangria ?? 0

    for (const linea of lineas) {
      agregarPaginaSiEsNecesario(altoLinea)
      pdf.text(linea, margen + sangria, posicionY)
      posicionY += altoLinea
    }
  }

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(20)
  pdf.setTextColor(30, 41, 59)
  pdf.text('Mis notas', margen, posicionY)
  posicionY += 9

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(100, 116, 139)
  pdf.text(
    `${notas.length} ${notas.length === 1 ? 'nota activa' : 'notas activas'} · Exportado ${formatearFecha(new Date().toISOString())}`,
    margen,
    posicionY,
  )
  posicionY += 12

  notas.forEach((nota, indice) => {
    agregarPaginaSiEsNecesario(24)

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(14)
    pdf.setTextColor(30, 41, 59)
    escribirLineas(
      pdf.splitTextToSize(
        `${indice + 1}. ${nota.titulo}`,
        anchoContenido,
      ),
      { altoLinea: 6 },
    )

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(100, 116, 139)
    escribirLineas([
      `${nota.actualizadoEn ? 'Actualizada' : 'Creada'}: ${formatearFecha(nota.actualizadoEn ?? nota.creadoEn)}`,
      `ID: ${nota.noteId}`,
    ], { altoLinea: 4.5 })

    posicionY += 2
    pdf.setFontSize(11)
    pdf.setTextColor(51, 65, 85)
    escribirLineas(
      pdf.splitTextToSize(nota.cuerpo, anchoContenido),
      { altoLinea: 5.5 },
    )

    posicionY += 5

    if (indice < notas.length - 1) {
      agregarPaginaSiEsNecesario(4)
      pdf.setDrawColor(203, 213, 225)
      pdf.line(margen, posicionY, anchoPagina - margen, posicionY)
      posicionY += 8
    }
  })

  const cantidadPaginas = pdf.getNumberOfPages()

  for (let pagina = 1; pagina <= cantidadPaginas; pagina++) {
    pdf.setPage(pagina)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(148, 163, 184)
    pdf.text(
      `Página ${pagina} de ${cantidadPaginas}`,
      anchoPagina / 2,
      altoPagina - 10,
      { align: 'center' },
    )
  }

  const fechaArchivo = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago',
  }).format(new Date())

  pdf.save(`notas-${fechaArchivo}.pdf`)
}
