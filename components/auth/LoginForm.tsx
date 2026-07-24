'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  loginSchema,
  loginDefaultValues,
  LoginFormData,
} from '@/schemas/loginSchema'
import InputField from '@/components/ui/InputField'
import Spinner from '@/components/ui/Spinner'
import { signIn } from 'aws-amplify/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginForm() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)
  const [redirigiendo, setRedirigiendo] = useState(false)

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: loginDefaultValues,
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setAuthError(null)
      await signIn({ username: data.email, password: data.password })
      setRedirigiendo(true)
      router.push('/notas')
    } catch (error: unknown) {
      if (error instanceof Error) {
        setAuthError('Email o contraseña incorrectos')
      }
    }
  }

  const cargando = methods.formState.isSubmitting || redirigiendo

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
        <button
          type='submit'
          disabled={cargando}
          className='flex items-center justify-center gap-2 w-full bg-blue-600 dark:bg-blue-500 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 dark:hover:bg-blue-600 disabled:hover:bg-blue-600 dark:disabled:hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {cargando && <Spinner size={14} />}
          {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>
    </FormProvider>
  )
}