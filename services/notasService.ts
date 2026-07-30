import axios from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'
import { Nota } from '@/types/nota'
import { PresignedUrlResponse } from '@/types/adjunto'
import { CredencialesInvitado } from '@/types/invitado'

const API_URL = 'https://nw3coiz3uj.execute-api.us-east-1.amazonaws.com'

const getToken = async () => {
  const session = await fetchAuthSession()
  return session.tokens?.idToken?.toString()
}

const apiClient = async () => {
  const token = await getToken()
  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: token
    }
  })
}

export const obtenerNotas = async (): Promise<Nota[]> => {
  const client = await apiClient()
  const { data } = await client.get('/notas')
  return data.data
}

export const crearNota = async (titulo: string, cuerpo: string): Promise<Nota> => {
  const client = await apiClient()
  const { data } = await client.post('/notas', { titulo, cuerpo })
  return data.data
}

export const actualizarNota = async (noteId: string, titulo: string, cuerpo: string, adjuntoKey?: string): Promise<Nota> => {
  const client = await apiClient()
  const { data } = await client.put(`/notas/${noteId}`, { titulo, cuerpo, adjuntoKey })
  return data.data
}

export const desactivarNota = async (noteId: string): Promise<Nota> => {
  const client = await apiClient()
  const { data } = await client.delete(`/notas/${noteId}`)
  return data.data
}

export const obtenerUrlSubida = async (noteId: string, tipoArchivo: string): Promise<PresignedUrlResponse> => {
  const client = await apiClient()
  const { data } = await client.post(`/notas/${noteId}/adjunto`, { tipoArchivo })
  return data
}

// Ruta pública — no requiere token, se usa antes de tener sesión
export const crearInvitado = async (): Promise<CredencialesInvitado> => {
  const { data } = await axios.post(`${API_URL}/invitado`)
  return data
}