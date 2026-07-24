'use client'

import React, { useEffect, useRef } from 'react'

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    // Redimensionar Canvas al tamaño completo del viewport
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Detectar si está en modo oscuro (revisando la clase 'dark' en el documento)
    const isDarkMode = () => document.documentElement.classList.contains('dark')

    // Generar las gotas de lluvia con física inicial
    const dropCount = 75
    const drops = Array.from({ length: dropCount }).map(() => ({
      x: Math.random() * (canvas.width * 1.4) - canvas.width * 0.2, // Margen extra a los lados para compensar el viento
      y: Math.random() * canvas.height,
      length: Math.random() * 18 + 10,  // Largo de la gota
      speed: Math.random() * 10 + 14,   // Velocidad de caída
      wind: Math.random() * 1.5 + 2.5,  // Ángulo/fuerza del viento hacia la derecha
      opacity: Math.random() * 0.5 + 0.2, // Transparencia para dar profundidad
    }))

    // Loop de animación a 60fps
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const dark = isDarkMode()

      drops.forEach((drop) => {
        ctx.beginPath()
        ctx.moveTo(drop.x, drop.y)
        // Traza la gota en diagonal (efecto viento)
        ctx.lineTo(drop.x + drop.wind * 2, drop.y + drop.length)

        // Color adaptable: Azul/Índigo intenso en modo claro, Celeste neón en modo oscuro
        ctx.strokeStyle = dark
          ? `rgba(56, 189, 248, ${drop.opacity})`     // sky-400
          : `rgba(37, 99, 235, ${drop.opacity + 0.15})` // blue-600 con un poco más de contraste

        ctx.lineWidth = 1.3
        ctx.lineCap = 'round'
        ctx.stroke()

        // Mover la gota
        drop.y += drop.speed
        drop.x += drop.wind

        // Si sale de la pantalla por abajo o por la derecha, la reiniciamos arriba
        if (drop.y > canvas.height || drop.x > canvas.width) {
          drop.y = -20
          drop.x = Math.random() * (canvas.width * 1.4) - canvas.width * 0.2
        }
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradiente de resplandor adaptable a Light/Dark Mode */}
      <div className="absolute inset-0 bg-linear-to-b from-blue-100/40 via-transparent to-slate-200/60 dark:from-slate-900/20 dark:via-transparent dark:to-slate-950/80" />

      {/* Canvas nativo súper fluido */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}