import { useEffect, useState } from 'react'

const ZONA_HORARIA = 'America/Santiago'

const obtenerPartesEnSantiago = (fecha: Date) => {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA_HORARIA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(fecha)

  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    Number(partes.find((parte) => parte.type === tipo)?.value)

  return {
    year: valor('year'),
    month: valor('month'),
    day: valor('day'),
    hour: valor('hour'),
    minute: valor('minute'),
    second: valor('second'),
  }
}

const obtenerDesfaseZonaHoraria = (fecha: Date) => {
  const partes = obtenerPartesEnSantiago(fecha)
  const fechaComoUtc = Date.UTC(
    partes.year,
    partes.month - 1,
    partes.day,
    partes.hour,
    partes.minute,
    partes.second,
  )

  return fechaComoUtc - fecha.getTime()
}

const convertirHoraSantiagoAUtc = (
  year: number,
  month: number,
  day: number,
  hour: number,
) => {
  const horaLocalComoUtc = Date.UTC(year, month - 1, day, hour)
  let fechaUtc = horaLocalComoUtc - obtenerDesfaseZonaHoraria(new Date(horaLocalComoUtc))

  fechaUtc = horaLocalComoUtc - obtenerDesfaseZonaHoraria(new Date(fechaUtc))
  return fechaUtc
}

const calcularTiempoRestante = () => {
  const ahora = new Date()
  const partes = obtenerPartesEnSantiago(ahora)
  const fechaLocal = new Date(Date.UTC(partes.year, partes.month - 1, partes.day))
  const diaSemana = fechaLocal.getUTCDay()

  let diasHastaDomingo = (7 - diaSemana) % 7

  if (diasHastaDomingo === 0 && partes.hour >= 3) {
    diasHastaDomingo = 7
  }

  fechaLocal.setUTCDate(fechaLocal.getUTCDate() + diasHastaDomingo)

  const proximaLimpieza = convertirHoraSantiagoAUtc(
    fechaLocal.getUTCFullYear(),
    fechaLocal.getUTCMonth() + 1,
    fechaLocal.getUTCDate(),
    3,
  )

  const diferenciaMs = Math.max(0, proximaLimpieza - ahora.getTime())
  const minutosTotales = Math.floor(diferenciaMs / (1000 * 60))

  return {
    dias: Math.floor(minutosTotales / (24 * 60)),
    horas: Math.floor((minutosTotales % (24 * 60)) / 60),
    minutos: minutosTotales % 60,
  }
}

export function useProximaLimpiezaSemanal() {
  const [tiempoRestante, setTiempoRestante] = useState(calcularTiempoRestante())

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempoRestante(calcularTiempoRestante())
    }, 60_000)

    return () => clearInterval(intervalo)
  }, [])

  return tiempoRestante
}
