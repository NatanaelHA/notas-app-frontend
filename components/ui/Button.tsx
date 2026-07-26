'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'motion/react'

export type ButtonVariant = 'indigo' | 'primary' | 'danger' | 'ghost'

const variantStyles: Record<ButtonVariant, { bg: string; shadow: string; border: string; glow: string }> = {
  indigo: {
    bg: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 hover:from-blue-600 hover:via-indigo-600 hover:to-indigo-700 dark:from-blue-600 dark:via-indigo-800 dark:to-indigo-950 dark:hover:from-blue-500 dark:hover:via-indigo-700 dark:hover:to-indigo-900',
    shadow: 'shadow-indigo-500/25',
    border: 'border-0 ring-1 ring-inset ring-white/25 dark:ring-indigo-400/30',
    glow: 'rgba(99, 102, 241, 0.4)',
  },
  primary: {
    bg: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
    shadow: 'shadow-blue-500/20',
    border: 'border-0',
    glow: 'rgba(37, 99, 235, 0.3)',
  },
  danger: {
    bg: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
    shadow: 'shadow-red-500/20',
    border: 'border-0',
    glow: 'rgba(220, 38, 38, 0.3)',
  },
  ghost: {
    bg: 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200',
    shadow: 'shadow-none',
    border: 'border border-slate-200 dark:border-slate-700',
    glow: 'rgba(0, 0, 0, 0.05)',
  },
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
  disabled,
  ...props
}: ButtonProps) {
  const styles = variantStyles[variant]
  const esGradiente = variant === 'indigo'

  return (
    <motion.button
      initial={false}
      whileHover={disabled ? {} : { scale: 1.03, y: -2, boxShadow: `0 10px 25px -5px ${styles.glow}` }}
      whileTap={disabled ? {} : { scale: 0.97, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      disabled={disabled}
      className={`relative group flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 shadow-md overflow-hidden transition-colors ${styles.bg} ${styles.shadow} ${styles.border} ${
        variant !== 'ghost' ? 'text-white' : ''
      } ${className}`}
      {...props}
    >
      {esGradiente && !disabled && (
        <span className="absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[350%] transition-transform duration-1000 ease-in-out pointer-events-none" />
      )}

      {icon && (
        <span className="transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110 flex items-center justify-center">
          {icon}
        </span>
      )}

      <span>{children}</span>
    </motion.button>
  )
}