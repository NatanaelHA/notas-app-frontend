import { useState, useCallback } from 'react'

interface UseTypewriterOptions {
  velocidadMs?: number
}

export function useTypewriter({ velocidadMs = 40 }: UseTypewriterOptions = {}) {
  // Se actualiza internamente durante la animación. No se consume afuera
  // todavía (LoginForm usa su propio estado "generandoInvitado" en su lugar),
  // pero se expone por si se necesita un indicador más granular a futuro
  // (ej: mostrar un cursor "|" parpadeante solo mientras escribe).
  const [escribiendo, setEscribiendo] = useState(false)

  const escribir = useCallback(
    (texto: string, onChange: (valorParcial: string) => void): Promise<void> => {
      return new Promise((resolve) => {
        setEscribiendo(true)
        let i = 0

        const intervalo = setInterval(() => {
          i++
          onChange(texto.slice(0, i))

          if (i >= texto.length) {
            clearInterval(intervalo)
            setEscribiendo(false)
            resolve()
          }
        }, velocidadMs)
      })
    },
    [velocidadMs]
  )

  return { escribir, escribiendo }
}