'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { BordeScroll } from './useScrollEdgeIndicator'

interface ScrollEdgeIndicatorProps {
  bordeScroll: BordeScroll
}

export default function ScrollEdgeIndicator({
  bordeScroll,
}: ScrollEdgeIndicatorProps) {
  const reducirMovimiento = useReducedMotion()

  return (
    <AnimatePresence>
      {!reducirMovimiento && bordeScroll && (
        <motion.div
          key={bordeScroll}
          initial={{
            opacity: 0,
            y: bordeScroll === 'arriba' ? -12 : 12,
            scale: 0.65,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: bordeScroll === 'arriba' ? -8 : 8,
            scale: 0.85,
          }}
          transition={{
            duration: 0.18,
            ease: 'easeOut',
          }}
          className={`pointer-events-none absolute inset-x-0 z-20 flex justify-center ${
            bordeScroll === 'arriba' ? 'top-1' : 'bottom-1'
          }`}
        >
          <motion.div
            aria-hidden='true'
            initial={{ opacity: 0, scaleY: 0.15 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.5 }}
            transition={{
              duration: 0.22,
              delay: 0.02,
              ease: 'easeOut',
            }}
            className={`absolute inset-x-0 z-0 ${
              bordeScroll === 'arriba'
                ? 'top-[-0.25rem] h-16 origin-top bg-gradient-to-b from-sky-400/40 via-sky-300/15 to-transparent dark:from-sky-700/35 dark:via-sky-800/15'
                : 'bottom-[-0.25rem] h-16 origin-bottom bg-gradient-to-t from-indigo-500/40 via-violet-400/15 to-transparent dark:from-indigo-700/35 dark:via-violet-800/15'
            }`}
            style={{
              clipPath:
                bordeScroll === 'arriba'
                  ? 'polygon(0 0, 100% 0, 62% 100%, 38% 100%)'
                  : 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)',
            }}
          />

          <motion.span
            initial={{
              clipPath:
                bordeScroll === 'arriba'
                  ? 'inset(100% 0 0 0)'
                  : 'inset(0 0 100% 0)',
            }}
            animate={{ clipPath: 'inset(0 0 0 0)' }}
            transition={{
              duration: 0.16,
              delay: 0.04,
              ease: 'easeOut',
            }}
            className={`relative z-10 text-4xl font-black leading-none ${
              bordeScroll === 'arriba'
                ? 'text-sky-500/65 dark:text-sky-500/55'
                : 'text-indigo-500/65 dark:text-indigo-500/55'
            }`}
          >
            N
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}