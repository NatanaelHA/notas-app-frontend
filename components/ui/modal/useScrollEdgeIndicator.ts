'use client'

import { useEffect, useRef, useState } from 'react'
import type { UIEvent } from 'react'

export type BordeScroll = 'arriba' | 'abajo' | null

export function useScrollEdgeIndicator() {
  const [bordeScroll, setBordeScroll] = useState<BordeScroll>(null)

  const ultimoBordeScrollRef = useRef<BordeScroll>(null)
  const yaSeDesplazoRef = useRef(false)

  const temporizadorIndicadorRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  const manejarScroll = (e: UIEvent<HTMLDivElement>) => {
    const contenedor = e.currentTarget

    const tieneScroll =
      contenedor.scrollHeight > contenedor.clientHeight + 1

    if (!tieneScroll) return

    const estaArriba = contenedor.scrollTop <= 2
    const estaAbajo =
      contenedor.scrollTop + contenedor.clientHeight >=
      contenedor.scrollHeight - 2

    if (contenedor.scrollTop > 8) {
      yaSeDesplazoRef.current = true
    }

    const bordeActual: BordeScroll = estaArriba
      ? 'arriba'
      : estaAbajo
        ? 'abajo'
        : null

    if (
      bordeActual === null ||
      (bordeActual === 'arriba' && !yaSeDesplazoRef.current)
    ) {
      ultimoBordeScrollRef.current = null
      return
    }

    if (ultimoBordeScrollRef.current === bordeActual) return

    ultimoBordeScrollRef.current = bordeActual
    setBordeScroll(bordeActual)

    if (temporizadorIndicadorRef.current) {
      clearTimeout(temporizadorIndicadorRef.current)
    }

    temporizadorIndicadorRef.current = setTimeout(() => {
      setBordeScroll(null)
    }, 420)
  }

  useEffect(() => {
    return () => {
      if (temporizadorIndicadorRef.current) {
        clearTimeout(temporizadorIndicadorRef.current)
      }
    }
  }, [])

  return {
    bordeScroll,
    manejarScroll,
  }
}