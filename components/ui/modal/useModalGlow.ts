'use client'

import { useEffect, useRef } from 'react'
import type { PointerEvent } from 'react'
import {
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'

export type ModalVariant = 'default' | 'guest'

export function useModalGlow(variant: ModalVariant) {
  const modalRef = useRef<HTMLDivElement>(null)

  const temporizadorBrilloRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  const reducirMovimiento = useReducedMotion()

  const brilloXObjetivo = useMotionValue(0)
  const brilloYObjetivo = useMotionValue(0)
  const opacidadBrilloObjetivo = useMotionValue(0)

  const haloXObjetivo = useMotionValue(0)
  const haloYObjetivo = useMotionValue(0)
  const opacidadHaloObjetivo = useMotionValue(0)

  const haloX = useSpring(haloXObjetivo, {
    stiffness: 180,
    damping: 26,
  })

  const haloY = useSpring(haloYObjetivo, {
    stiffness: 180,
    damping: 26,
  })

  const opacidadHalo = useSpring(opacidadHaloObjetivo, {
    stiffness: 150,
    damping: 24,
  })

  const brilloX = useSpring(brilloXObjetivo, {
    stiffness: 260,
    damping: 28,
  })

  const brilloY = useSpring(brilloYObjetivo, {
    stiffness: 260,
    damping: 28,
  })

  const opacidadBrillo = useSpring(opacidadBrilloObjetivo, {
    stiffness: 180,
    damping: 24,
  })

  const configuracionBrilloClaro =
    variant === 'guest'
      ? {
          radio: 190,
          centro: 'rgba(37, 99, 235, 1)',
          azulClaro: 'rgba(30, 64, 175, 0.85)',
          azulProfundo: 'rgba(30, 58, 138, 0.5)',
        }
      : {
          radio: 150,
          centro: 'rgba(59, 130, 246, 0.95)',
          azulClaro: 'rgba(37, 99, 235, 0.72)',
          azulProfundo: 'rgba(29, 78, 216, 0.38)',
        }

  const configuracionBrilloOscuro =
    variant === 'guest'
      ? {
          radio: 190,
          centro: 'rgba(219, 234, 254, 1)',
          azulClaro: 'rgba(96, 165, 250, 0.7)',
          azulProfundo: 'rgba(59, 130, 246, 0.35)',
        }
      : {
          radio: 150,
          centro: 'rgba(219, 234, 254, 0.8)',
          azulClaro: 'rgba(96, 165, 250, 0.45)',
          azulProfundo: 'rgba(59, 130, 246, 0.2)',
        }

  const fondoBrilloClaro = useMotionTemplate`
    radial-gradient(
      ${configuracionBrilloClaro.radio}px circle at ${brilloX}px ${brilloY}px,
      ${configuracionBrilloClaro.centro},
      ${configuracionBrilloClaro.azulClaro} 35%,
      ${configuracionBrilloClaro.azulProfundo} 58%,
      transparent 78%
    )
  `

  const fondoBrilloOscuro = useMotionTemplate`
    radial-gradient(
      ${configuracionBrilloOscuro.radio}px circle at ${brilloX}px ${brilloY}px,
      ${configuracionBrilloOscuro.centro},
      ${configuracionBrilloOscuro.azulClaro} 35%,
      ${configuracionBrilloOscuro.azulProfundo} 58%,
      transparent 78%
    )
  `

  const fondoHaloClaro = useMotionTemplate`
    radial-gradient(
      220px circle at ${haloX}px ${haloY}px,
      rgba(37, 99, 235, 0.3),
      rgba(59, 130, 246, 0.14) 32%,
      transparent 33%
    )
  `

  const manejarMovimiento = (e: PointerEvent<HTMLDivElement>) => {
    if (reducirMovimiento || e.pointerType !== 'mouse' || !modalRef.current) {
      return
    }

    const rect = modalRef.current.getBoundingClientRect()

    const cursorDentroDelModal =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom

    if (cursorDentroDelModal) {
      opacidadHaloObjetivo.set(0)
      opacidadBrilloObjetivo.set(0)
      return
    }

    const posicionX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width)
    const posicionY = Math.min(Math.max(e.clientY - rect.top, 0), rect.height)

    brilloXObjetivo.set(posicionX)
    brilloYObjetivo.set(posicionY)

    haloXObjetivo.set(rect.left + posicionX)
    haloYObjetivo.set(rect.top + posicionY)

    opacidadBrilloObjetivo.set(1)
    opacidadHaloObjetivo.set(1)
  }

  const ocultarBrillo = () => {
    opacidadBrilloObjetivo.set(0)
    opacidadHaloObjetivo.set(0)
  }

  const manejarToque = (e: PointerEvent<HTMLDivElement>) => {
    if (reducirMovimiento || e.pointerType !== 'touch' || !modalRef.current) {
      return
    }

    const rect = modalRef.current.getBoundingClientRect()

    const posicionX = Math.min(Math.max(e.clientX - rect.left, 0), rect.width)
    const posicionY = Math.min(Math.max(e.clientY - rect.top, 0), rect.height)

    const distancias = {
      izquierda: posicionX,
      derecha: rect.width - posicionX,
      arriba: posicionY,
      abajo: rect.height - posicionY,
    }

    const distanciaMinima = Math.min(...Object.values(distancias))

    if (distanciaMinima === distancias.izquierda) {
      brilloXObjetivo.set(0)
      brilloYObjetivo.set(posicionY)
    } else if (distanciaMinima === distancias.derecha) {
      brilloXObjetivo.set(rect.width)
      brilloYObjetivo.set(posicionY)
    } else if (distanciaMinima === distancias.arriba) {
      brilloXObjetivo.set(posicionX)
      brilloYObjetivo.set(0)
    } else {
      brilloXObjetivo.set(posicionX)
      brilloYObjetivo.set(rect.height)
    }

    opacidadBrilloObjetivo.set(1)

    if (temporizadorBrilloRef.current) {
      clearTimeout(temporizadorBrilloRef.current)
    }

    temporizadorBrilloRef.current = setTimeout(() => {
      opacidadBrilloObjetivo.set(0)
    }, 650)
  }

  useEffect(() => {
    return () => {
      if (temporizadorBrilloRef.current) {
        clearTimeout(temporizadorBrilloRef.current)
      }
    }
  }, [])

  return {
    modalRef,
    fondoBrilloClaro,
    fondoBrilloOscuro,
    fondoHaloClaro,
    opacidadBrillo,
    opacidadHalo,
    manejarMovimiento,
    ocultarBrillo,
    manejarToque,
  }
}