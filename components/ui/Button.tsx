'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'motion/react'

export type ButtonVariant = 'indigo' | 'danger' | 'warning' | 'success' | 'ghost'

const variantStyles: Record<ButtonVariant, { bg: string; shadow: string; border: string; glow: string }> = {
    indigo: {
      // Light: Azul brillante -> Índigo -> Índigo más profundo (pero no oscuro)
      // Dark:  Azul -> Índigo oscuro -> Índigo profundo/noche
      bg: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 hover:from-blue-600 hover:via-indigo-600 hover:to-indigo-700 dark:from-blue-600 dark:via-indigo-800 dark:to-indigo-950 dark:hover:from-blue-500 dark:hover:via-indigo-700 dark:hover:to-indigo-900',
      shadow: 'shadow-indigo-500/25',
      border: 'border-0 ring-1 ring-inset ring-white/25 dark:ring-indigo-400/30',
      glow: 'rgba(99, 102, 241, 0.4)',
    },
    danger: {
      // Light: Rojo vivo -> Rose -> Rose profundo
      // Dark:  Rojo -> Rose oscuro -> Rose profundo/noche
      bg: 'bg-gradient-to-r from-red-500 via-rose-500 to-rose-600 hover:from-red-600 hover:via-rose-600 hover:to-rose-700 dark:from-red-600 dark:via-rose-800 dark:to-rose-950 dark:hover:from-red-500 dark:hover:via-rose-700 dark:hover:to-rose-900',
      shadow: 'shadow-red-500/25',
      border: 'border-0 ring-1 ring-inset ring-white/25 dark:ring-rose-400/30',
      glow: 'rgba(244, 63, 94, 0.4)',
    },
    warning: {
      // Light: Amber -> Naranja -> Naranja profundo
      // Dark:  Amber -> Naranja oscuro -> Amber/Naranja muy oscuro
      bg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-600 hover:via-orange-600 hover:to-orange-700 dark:from-amber-600 dark:via-orange-800 dark:to-amber-950 dark:hover:from-amber-500 dark:hover:via-orange-700 dark:hover:to-amber-900',
      shadow: 'shadow-amber-500/25',
      border: 'border-0 ring-1 ring-inset ring-white/25 dark:ring-orange-400/30',
      glow: 'rgba(245, 158, 11, 0.4)',
    },
    success: {
      // Light: Esmeralda -> Teal -> Teal profundo
      // Dark:  Esmeralda -> Teal oscuro -> Teal profundo/noche
      bg: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-teal-600 hover:from-emerald-600 hover:via-teal-600 hover:to-teal-700 dark:from-emerald-600 dark:via-teal-800 dark:to-teal-950 dark:hover:from-emerald-500 dark:hover:via-teal-700 dark:hover:to-teal-900',
      shadow: 'shadow-emerald-500/25',
      border: 'border-0 ring-1 ring-inset ring-white/25 dark:ring-teal-400/30',
      glow: 'rgba(16, 185, 129, 0.4)',
    },
    ghost: {
      bg: 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200',
      shadow: 'shadow-none',
      border: 'border border-slate-200 dark:border-slate-700',
      glow: 'rgba(0, 0, 0, 0.05)',
    }
  }

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant
  icon?: React.ReactNode
  children: React.ReactNode
}

export default function Button({
  variant = 'indigo',
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant]

  return (
    <motion.button
      initial={false}
      whileHover={{
        scale: 1.03,
        y: -2,
        boxShadow: `0 10px 25px -5px ${styles.glow}`,
      }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`relative group flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow-md overflow-hidden transition-colors ${styles.bg} ${styles.shadow} ${styles.border} ${
        variant !== 'ghost' ? 'text-white' : ''
      } ${className}`}
      {...props}
    >
      {/* Destello suave que arranca bien lejos a la izquierda */}
      {variant !== 'ghost' && (
        <span className="absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[350%] transition-transform duration-1000 ease-in-out pointer-events-none" />
      )}

      {/* Ícono dinámico */}
      {icon && (
        <span className="transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110 flex items-center justify-center">
          {icon}
        </span>
      )}

      <span>{children}</span>
    </motion.button>
  )
}