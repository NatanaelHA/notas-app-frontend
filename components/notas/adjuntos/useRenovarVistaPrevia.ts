'use client'

import { useEffect, useRef, useState } from 'react'

export function useRenovarVistaPrevia(
  url: string | undefined,
  renovarUrl: (() => Promise<string>) | undefined,
  disabled: boolean,
) {
  const [urlRenovada, setUrlRenovada] = useState<string>()
  const [error, setError] = useState(false)
  const [renovando, setRenovando] = useState(false)
  const intentoAutomatico = useRef(false)
  const enCurso = useRef(false)
  const montado = useRef(true)

  useEffect(() => {
    montado.current = true
    return () => { montado.current = false }
  }, [])

  const reintentar = async () => {
    if (!renovarUrl || disabled || enCurso.current) return
    intentoAutomatico.current = true
    enCurso.current = true
    setRenovando(true)
    setError(false)

    try {
      const nuevaUrl = await renovarUrl()
      if (!montado.current) return
      if (nuevaUrl === (urlRenovada ?? url)) {
        setError(true)
      } else {
        setUrlRenovada(nuevaUrl)
      }
    } catch {
      if (montado.current) setError(true)
    } finally {
      enCurso.current = false
      if (montado.current) setRenovando(false)
    }
  }

  // Renueva una sola vez automáticamente; los siguientes intentos son manuales.
  const alFallar = () => {
    if (enCurso.current) return
    setError(true)
    if (!intentoAutomatico.current) void reintentar()
  }

  return { url: urlRenovada ?? url, error, renovando, alFallar, reintentar }
}
