'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

type ClientFormValues = {
  nom: string
  email: string
  telefon: string
  contrasenya: string
}

type SubmissionState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

const defaultState: SubmissionState = { status: 'idle' }

export function InsertClientForm() {
  const [submission, setSubmission] = useState<SubmissionState>(defaultState)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>()

  const onSubmit = async (values: ClientFormValues) => {
    setSubmission({ status: 'idle' })

    try {
      const response = await fetch('/api/insert-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.message ?? "No s'ha pogut insertar el client")
      }

      setSubmission({ status: 'success', message: 'Cliente insertado correctamente.' })
      reset()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ha ocurrido un error inesperat. Intenta-ho de nou.'
      setSubmission({ status: 'error', message })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card space-y-5"
      noValidate
    >
      <div>
        <label className="block text-sm font-medium text-stone-200" htmlFor="nom">
          Nom i cognoms
        </label>
        <input
          id="nom"
          type="text"
          className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
          placeholder="Laura Martínez"
          {...register('nom', {
            required: 'El nom es obligatori',
            minLength: { value: 3, message: 'Introduce al menos 3 caracteres' },
          })}
        />
        {errors.nom ? (
          <p className="mt-1 text-sm text-red-300">{errors.nom.message}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-200" htmlFor="email">
          Email de contacte
        </label>
        <input
          id="email"
          type="email"
          className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
          placeholder="laura@example.com"
          {...register('email', {
            required: 'El email es obligatori',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Introduce un email vàlid',
            },
          })}
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="telefon">
            Telèfon
          </label>
          <input
            id="telefon"
            type="tel"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
            placeholder="612345678"
            {...register('telefon', {
              required: 'El telèfon es obligatori',
              minLength: { value: 9, message: 'Introduce 9 dígitos' },
            })}
          />
          {errors.telefon ? (
            <p className="mt-1 text-sm text-red-300">{errors.telefon.message}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="contrasenya">
            Contrasenya
          </label>
          <input
            id="contrasenya"
            type="password"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
            placeholder="•••••••"
            {...register('contrasenya', {
              required: 'La contrasenya es obligatoria',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' },
            })}
          />
          {errors.contrasenya ? (
            <p className="mt-1 text-sm text-red-300">{errors.contrasenya.message}</p>
          ) : null}
        </div>
      </div>

      <button className="button-primary w-full md:w-auto" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Insertant...' : 'Insertar client'}
      </button>

      {submission.status === 'success' ? (
        <p className="text-sm text-emerald-300">{submission.message}</p>
      ) : null}

      {submission.status === 'error' ? (
        <p className="text-sm text-red-300">{submission.message}</p>
      ) : null}
    </form>
  )
}

export default InsertClientForm
