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

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const isDarkMode = () => document.documentElement.classList.contains('dark')

    const dropCount = 75
    const drops = Array.from({ length: dropCount }).map(() => ({
      x: Math.random() * (canvas.width * 1.4) - canvas.width * 0.2,
      y: Math.random() * canvas.height,
      length: Math.random() * 18 + 10,
      speed: Math.random() * 10 + 14,
      wind: Math.random() * 1.5 + 2.5,
      opacity: Math.random() * 0.5 + 0.2,
    }))

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const dark = isDarkMode()

      if (dark) {
        drops.forEach((drop) => {
          ctx.beginPath()
          ctx.moveTo(drop.x, drop.y)
          ctx.lineTo(drop.x + drop.wind * 2, drop.y + drop.length)

          ctx.strokeStyle = `rgba(56, 189, 248, ${drop.opacity})`
          ctx.lineWidth = 1.3
          ctx.lineCap = 'round'
          ctx.stroke()

          drop.y += drop.speed
          drop.x += drop.wind

          if (drop.y > canvas.height || drop.x > canvas.width) {
            drop.y = -20
            drop.x = Math.random() * (canvas.width * 1.4) - canvas.width * 0.2
          }
        })
      }

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
      {/* 🌤️ MODO CLARO: Sol Móvil y Nubes Distribuidas */}
      <div className="absolute inset-0 block dark:hidden">
        <style jsx>{`
          @keyframes float-drift {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100vw); }
          }
          @keyframes sun-traverse {
            0% { transform: translateX(-30vw); }
            100% { transform: translateX(110vw); }
          }
          .animate-sun-move {
            animation: sun-traverse 60s linear infinite;
          }
          .animate-cloud-slow {
            animation: float-drift 40s linear infinite;
          }
          .animate-cloud-medium {
            animation: float-drift 25s linear infinite;
          }
          .animate-cloud-fast {
            animation: float-drift 18s linear infinite;
          }
        `}</style>

        {/* Fondo degradado cálido diurno */}
        <div className="absolute inset-0 bg-linear-to-b from-sky-200/70 via-amber-50/40 to-slate-100" />

        {/* ☀️ SOL EN MOVIMIENTO LENTO DE IZQUIERDA A DERECHA */}
        <div className="absolute top-[12%] left-0 w-full animate-sun-move">
          <div className="relative w-64 h-64 -translate-y-1/2">
            {/* Halo suave externo */}
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-amber-300 via-amber-400 to-orange-400 opacity-75 blur-3xl animate-pulse" />
            {/* Núcleo resplandeciente del Sol */}
            <div className="absolute inset-8 rounded-full bg-amber-100/90 blur-xl" />
          </div>
        </div>

        {/* --- NUBES DISTRIBUIDAS A DIFERENTES ALTURAS Y VELOCIDADES --- */}

        {/* Nube 1: Parte Superior (Lenta) */}
        <div className="absolute top-[8%] left-0 w-full animate-cloud-slow">
          <div className="w-md h-24 bg-white/70 blur-xl rounded-full" />
        </div>

        {/* Nube 2: Zona Media-Alta (Velocidad Media) */}
        <div className="absolute top-[25%] left-0 w-full animate-cloud-medium [animation-delay:-8s]">
          <div className="w-xl h-32 bg-sky-100/60 blur-2xl rounded-full" />
        </div>

        {/* Nube 3: Centro de la Pantalla (Rápida y más visible) */}
        <div className="absolute top-[45%] left-0 w-full animate-cloud-fast [animation-delay:-14s]">
          <div className="w-120 h-28 bg-white/80 blur-xl rounded-full" />
        </div>

        {/* Nube 4: Zona Media-Baja */}
        <div className="absolute top-[65%] left-0 w-full animate-cloud-slow [animation-delay:-22s]">
          <div className="w-160 h-36 bg-amber-100/50 blur-3xl rounded-full" />
        </div>

        {/* Nube 5: Fondo suave en la base */}
        <div className="absolute bottom-0 left-0 w-full animate-cloud-medium [animation-delay:-3s]">
          <div className="w-lg h-24 bg-white/60 blur-2xl rounded-full" />
        </div>
      </div>

      {/* 🌧️ MODO OSCURO: Lluvia Canvas */}
      <div className="absolute inset-0 hidden dark:block bg-linear-to-b from-slate-900/40 via-transparent to-slate-950/90" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full hidden dark:block" />
    </div>
  )
}