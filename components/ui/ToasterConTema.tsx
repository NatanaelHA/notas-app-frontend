'use client'

import { Toaster } from 'sonner'
import { useTheme } from 'next-themes'

export default function ToasterConTema() {
  const { resolvedTheme } = useTheme()

  return (
    <Toaster
      position='top-center'
      richColors
      theme={resolvedTheme as 'light' | 'dark'}
    />
  )
}