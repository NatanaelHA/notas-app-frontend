import { useState, useEffect } from 'react'

// Calcula cuántos minutos y segundos faltan para que el reloj marque la próxima hora en punto
const calcularTiempoRestante = () => {
  const ahora = new Date()
  const minutos = 59 - ahora.getMinutes()
  const segundos = 59 - ahora.getSeconds()
  return { minutos, segundos }
}

export function useProximaLimpieza() {
  const [tiempoRestante, setTiempoRestante] = useState(calcularTiempoRestante())

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTiempoRestante(calcularTiempoRestante())
    }, 1000)

    return () => clearInterval(intervalo)
  }, [])

  return tiempoRestante
}