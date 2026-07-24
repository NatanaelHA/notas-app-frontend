import { obtenerNotasServer } from '@/services/notasServerService'
import { Nota } from '@/types/nota'
import ListaNotas from '@/components/notas/ListaNotas'
import { NotasProvider } from '@/context/notas/NotasContext'

export const metadata = {
  title: 'Mis Notas - Notas App',
}

export default async function NotasPage() {
  const notas: Nota[] = await obtenerNotasServer()

  return (
    <NotasProvider notasIniciales={notas}>
      <h1 className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6'>
        Mis Notas
      </h1>
      <ListaNotas />
    </NotasProvider>
  )
}
