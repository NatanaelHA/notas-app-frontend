import { fetchAuthSession } from 'aws-amplify/auth/server'
import { runWithAmplifyServerContext } from '@/lib/amplifyServer'
import { cookies } from 'next/headers'
import { Nota } from '@/types/nota'

const API_URL = 'https://nw3coiz3uj.execute-api.us-east-1.amazonaws.com'

export const obtenerNotasServer = async (): Promise<Nota[]> => {
  const token = await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    operation: async (contextSpec) => {
      const session = await fetchAuthSession(contextSpec)
      return session.tokens?.idToken?.toString()
    }
  })

  const response = await fetch(`${API_URL}/notas`, {
    headers: {
      Authorization: token ?? ''
    }
  })

  const data = await response.json()
  return data.data
}