import axios from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'
import { Nota } from '@/types/nota'
import { PresignedUrlResponse } from '@/types/adjunto'
import { CredencialesInvitado } from '@/types/invitado'

const API_URL = 'https://nw3coiz3uj.execute-api.us-east-1.amazonaws.com'

/* ------------------------------------------------------------------------- */
/* CONFIGURACIÓN Y AUTENTICACIÓN                                             */
/* ------------------------------------------------------------------------- */

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

/* ------------------------------------------------------------------------- */
/* CRUD DE NOTAS                                                             */
/* ------------------------------------------------------------------------- */

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

export const actualizarNota = async (noteId: string, titulo: string, cuerpo: string): Promise<Nota> => {
  const client = await apiClient()
  const { data } = await client.put(`/notas/${noteId}`, { titulo, cuerpo })
  return data.data
}

export const desactivarNota = async (noteId: string): Promise<Nota> => {
  const client = await apiClient()
  const { data } = await client.delete(`/notas/${noteId}`)
  return data.data
}

/* ------------------------------------------------------------------------- */
/* ADJUNTOS Y S3                                                             */
/* ------------------------------------------------------------------------- */

export const obtenerUrlSubida = async (noteId: string, archivo: File): Promise<PresignedUrlResponse> => {
  const client = await apiClient()
  const { data } = await client.post(`/notas/${noteId}/adjunto`, {
    nombreArchivo: archivo.name,
    tipoArchivo: archivo.type,
    tamanoArchivo: archivo.size,
  })
  return data
}

// Función del frontend: usa la presigned URL obtenida del backend para subir el archivo directamente a S3.
export const subirAdjuntoAS3 = async (url: string, archivo: File): Promise<void> => {
  await axios.put(url, archivo, {
    headers: {
      'Content-Type': archivo.type,
    },
  })
}

export const asociarAdjunto = async (
  noteId: string,
  adjuntoRuta: string,
  nombreArchivo: string,
): Promise<Nota> => {
  const client = await apiClient()
  const { data } = await client.put(`/notas/${noteId}/adjunto`, {
    adjuntoRuta,
    nombreArchivo,
  })
  return data.data
}

/* ------------------------------------------------------------------------- */
/* USUARIOS INVITADOS                                                        */
/* ------------------------------------------------------------------------- */

// Ruta pública — no requiere token, se usa antes de tener sesión
export const crearInvitado = async (): Promise<CredencialesInvitado> => {
  const { data } = await axios.post(`${API_URL}/invitado`)
  return data
}
