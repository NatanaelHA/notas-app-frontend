'use client'

import { createContext, useContext, ReactNode } from 'react'
import { Nota } from '@/types/nota'
import { useNotasState } from './useNotasState'

type NotasContextType = ReturnType<typeof useNotasState>

const NotasContext = createContext<NotasContextType | undefined>(undefined)

export function NotasProvider({ children, notasIniciales }: { children: ReactNode; notasIniciales: Nota[] }) {
  const state = useNotasState(notasIniciales)

  return (
    <NotasContext.Provider value={state}>
      {children}
    </NotasContext.Provider>
  )
}

export function useNotasContext() {
  const context = useContext(NotasContext)
  if (!context) {
    throw new Error('useNotasContext debe usarse dentro de /notas (NotasProvider)')
  }
  return context
}