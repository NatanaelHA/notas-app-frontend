const STORAGE_KEY = 'notas-app-invitado'

interface CredencialesGuardadas {
  email: string
  password: string
}

export const guardarCredencialesInvitado = (email: string, password: string) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ email, password }))
}

export const obtenerCredencialesInvitado = (): CredencialesGuardadas | null => {
  if (typeof window === 'undefined') return null

  const guardado = localStorage.getItem(STORAGE_KEY)
  if (!guardado) return null

  try {
    return JSON.parse(guardado)
  } catch {
    return null
  }
}

export const eliminarCredencialesInvitado = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}