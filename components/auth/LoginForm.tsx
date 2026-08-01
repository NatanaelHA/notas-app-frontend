'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  loginSchema,
  loginDefaultValues,
  LoginFormData,
} from '@/schemas/loginSchema'
import InputField from '@/components/ui/InputField'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { signIn, fetchUserAttributes  } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { crearInvitado } from '@/services/notasService'
import { useTypewriter } from '@/hooks/useTypewriter'
import { guardarCredencialesInvitado } from '@/lib/invitadoStorage'
import { Sparkles } from 'lucide-react'

export default function LoginForm() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)
  const [redirigiendo, setRedirigiendo] = useState(false)
  const [generandoInvitado, setGenerandoInvitado] = useState(false)
  const { escribir } = useTypewriter({ velocidadMs: 35 })

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError(null)
      await signIn({ username: data.email, password: data.password })

      const attrs = await fetchUserAttributes()

if (attrs['custom:esInvitado'] === 'true') {
  guardarCredencialesInvitado(data.email, data.password)
}

      setRedirigiendo(true)
      router.push('/notas')
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAuthError('Email o contraseña incorrectos')
      }
    }
  }

  const handleProbarInvitado = async () => {
    try {
      setAuthError(null)
      setGenerandoInvitado(true)

      const { email, password } = await crearInvitado()

      await escribir(email, (valor) => methods.setValue('email', valor))
      await escribir(password, (valor) => methods.setValue('password', valor))

      guardarCredencialesInvitado(email, password)

      await signIn({ username: email, password })
      setRedirigiendo(true)
      router.push('/notas')
    } catch (error: unknown) {
      console.error('Error al generar invitado:', error)
      setAuthError('No se pudo generar la cuenta de invitado, intenta de nuevo')
      setGenerandoInvitado(false)
    }
  }

  const cargando = methods.formState.isSubmitting || redirigiendo || generandoInvitado

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className='space-y-4'
      >
        <fieldset disabled={cargando} className='space-y-4'>
          <InputField label='Email' name='email' type='email' />
          <InputField label='Contraseña' name='password' type='password' />
        </fieldset>
        {authError && (
          <p className='text-red-500 dark:text-red-400 text-sm text-center'>{authError}</p>
        )}
        <Button
          type='submit'
          variant='primary'
          disabled={cargando}
          icon={methods.formState.isSubmitting || redirigiendo ? <Spinner size={14} /> : undefined}
          className='w-full'
        >
          {methods.formState.isSubmitting || redirigiendo ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>

        <Button
          type='button'
          variant='indigo'
          disabled={cargando}
          onClick={handleProbarInvitado}
          icon={generandoInvitado ? <Spinner size={14} /> : <Sparkles size={16} />}
          className='w-full'
        >
          {generandoInvitado ? 'Generando cuenta...' : 'Probar como invitado'}
        </Button>
      </form>
    </FormProvider>
  )
}