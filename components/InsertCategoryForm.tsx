'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

type CategoryFormValues = {
  nom: string
}

type SubmissionState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

const defaultState: SubmissionState = { status: 'idle' }

export function InsertCategoryForm() {
  const [submission, setSubmission] = useState<SubmissionState>(defaultState)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>()

  const onSubmit = async (values: CategoryFormValues) => {
    setSubmission({ status: 'idle' })

    try {
      const response = await fetch('/api/insert-categoria', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.message ?? 'No se pudo insertar la categoría')
      }

      setSubmission({ status: 'success', message: 'Categoría insertada correctamente.' })
      reset()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ha ocurrido un error inesperado. Inténtalo de nuevo.'
      setSubmission({ status: 'error', message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5" noValidate>
      <div>
        <label className="block text-sm font-medium text-stone-200" htmlFor="nom-categoria">
          Nombre de la categoría
        </label>
        <input
          id="nom-categoria"
          type="text"
          className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
          placeholder="Carnes"
          {...register('nom', {
            required: 'El nombre es obligatorio',
            minLength: { value: 3, message: 'Introduce al menos 3 caracteres' },
          })}
        />
        {errors.nom ? <p className="mt-1 text-sm text-red-300">{errors.nom.message}</p> : null}
      </div>

      <button className="button-primary w-full md:w-auto" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Insertando...' : 'Insertar categoría'}
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

export default InsertCategoryForm
