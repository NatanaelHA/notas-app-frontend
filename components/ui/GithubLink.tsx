'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown } from 'lucide-react'

interface GithubLinkProps {
  className?: string
}

const repos = [
  {
    nombre: 'Frontend',
    url: 'https://github.com/NatanaelHA/notas-app-frontend',
  },
  {
    nombre: 'Backend · Notas',
    url: 'https://github.com/NatanaelHA/notas-app-backend',
  },
  {
    nombre: 'Backend · Usuarios',
    url: 'https://github.com/NatanaelHA/notas-app-usuarios',
  },
]

const IconoGithub = () => (
  <svg viewBox='0 0 24 24' width={18} height={18} fill='currentColor'>
    <path d='M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.07.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z' />
  </svg>
)

export default function GithubLink({ className = '' }: GithubLinkProps) {
  const [abierto, setAbierto] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <button
        type='button'
        onClick={() => setAbierto(!abierto)}
        className='flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
      >
        <IconoGithub />

        <span className='hidden sm:inline'>Ver código</span>

        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform ${
            abierto ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {abierto && (
          <>
            <div
              className='fixed inset-0 z-10'
              onClick={() => setAbierto(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className='absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800'
            >
              {repos.map((repo) => (
                <a
                  key={repo.url}
                  href={repo.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() => setAbierto(false)}
                  className='block px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700'
                >
                  {repo.nombre}
                </a>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
