'use client'

import { motion } from 'motion/react'
import type { MotionValue } from 'motion/react'

interface ModalHaloProps {
  fondoHaloClaro: MotionValue<string>
  opacidadHalo: MotionValue<number>
}

export function ModalHalo({
  fondoHaloClaro,
  opacidadHalo,
}: ModalHaloProps) {
  return (
    <motion.div
      aria-hidden='true'
      className='pointer-events-none absolute inset-0 z-0 dark:hidden'
      style={{
        background: fondoHaloClaro,
        opacity: opacidadHalo,
      }}
    />
  )
}

interface ModalBorderGlowProps {
  fondoBrilloClaro: MotionValue<string>
  fondoBrilloOscuro: MotionValue<string>
  opacidadBrillo: MotionValue<number>
}

export function ModalBorderGlow({
  fondoBrilloClaro,
  fondoBrilloOscuro,
  opacidadBrillo,
}: ModalBorderGlowProps) {
  return (
    <>
      <motion.div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 z-0 rounded-2xl p-px dark:hidden'
        style={{
          background: fondoBrilloClaro,
          opacity: opacidadBrillo,
        }}
      >
        <div className='h-full w-full rounded-[15px] bg-white' />
      </motion.div>

      <motion.div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 z-0 hidden rounded-2xl p-px dark:block'
        style={{
          background: fondoBrilloOscuro,
          opacity: opacidadBrillo,
        }}
      >
        <div className='h-full w-full rounded-[15px] bg-slate-800' />
      </motion.div>
    </>
  )
}