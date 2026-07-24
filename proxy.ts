import { NextRequest, NextResponse } from 'next/server'
import { fetchAuthSession } from 'aws-amplify/auth/server'
import { runWithAmplifyServerContext } from '@/lib/amplifyServer'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar sesión
  const isAuthenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response: NextResponse.next() },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec)
        return session.tokens !== undefined
      } catch {
        return false
      }
    }
  })

  // Rutas protegidas → redirigir a login si no está autenticado
  if (pathname.startsWith('/notas') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si está autenticado y va al login → redirigir a notas
  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/notas', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/notas/:path*', '/login']
}