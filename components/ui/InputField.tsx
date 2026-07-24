'use client'

import { useFormContext } from 'react-hook-form'
import { Mail, Lock, Type } from 'lucide-react'

interface InputFieldProps {
  label: string
  name: string
  type?: string
  className?: string
  [key: string]: unknown
}

const iconos: Record<string, React.ElementType> = {
  email: Mail,
  password: Lock,
  text: Type,
}

const InputField = ({ label, name, type = 'text', className = '', ...props }: InputFieldProps) => {
  const { register, formState: { errors } } = useFormContext()
  const error = errors[name]
  const Icono = iconos[type]

  return (
    <div className='flex flex-col text-left'>
      {label && (
        <label htmlFor={name} className='text-sm font-medium text-slate-700 dark:text-slate-300 mb-1'>
          {label}
        </label>
      )}
      <div className='relative'>
        {Icono && (
          <Icono
            size={16}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500'
          />
        )}
        <input
          id={name}
          type={type}
          {...register(name)}
          {...props}
          className={`
            w-full rounded-md border px-3 py-2 text-sm text-slate-900 dark:text-slate-100
            bg-white dark:bg-slate-900
            focus:outline-none focus:ring-2 transition
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800
            ${Icono ? 'pl-9' : ''}
            ${error
              ? 'border-red-500 dark:border-red-500 focus:ring-red-500'
              : 'border-slate-300 dark:border-slate-600 focus:ring-blue-500'
            }
            ${className}
          `}
        />
      </div>
      {error && (
        <span className='text-red-500 dark:text-red-400 text-xs mt-1'>{error.message as string}</span>
      )}
    </div>
  )
}

export default InputField