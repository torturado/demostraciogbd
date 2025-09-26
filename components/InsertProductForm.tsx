'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

type ProductFormValues = {
  nom: string
  preu: number
  idcategoria: number
  disponible: boolean
}

type SubmissionState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

const defaultState: SubmissionState = { status: 'idle' }

export function InsertProductForm() {
  const [submission, setSubmission] = useState<SubmissionState>(defaultState)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    defaultValues: {
      disponible: true,
    },
  })

  const onSubmit = async (values: ProductFormValues) => {
    setSubmission({ status: 'idle' })

    try {
      const response = await fetch('/api/insert-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.message ?? "No s'ha pogut insertar el producte")
      }

      setSubmission({ status: 'success', message: 'Producto insertado correctamente.' })
      reset({ disponible: true })
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Ha ocurrido un error inesperat. Intenta-ho de nou.'
      setSubmission({ status: 'error', message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5" noValidate>
      <div>
        <label className="block text-sm font-medium text-stone-200" htmlFor="nom-producte">
          Nom del producte
        </label>
        <input
          id="nom-producte"
          type="text"
          className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
          placeholder="Pizza Calzone"
          {...register('nom', {
            required: 'El nom es obligatori',
            minLength: { value: 2, message: 'Introduce al menos 2 caracteres' },
          })}
        />
        {errors.nom ? <p className="mt-1 text-sm text-red-300">{errors.nom.message}</p> : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="preu">
            Preu (€)
          </label>
          <input
            id="preu"
            type="number"
            step="0.01"
            min="0"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
            placeholder="12.50"
            {...register('preu', {
              valueAsNumber: true,
              required: 'El preu es obligatori',
              min: { value: 0, message: 'El preu no pot ser negatiu' },
            })}
          />
          {errors.preu ? <p className="mt-1 text-sm text-red-300">{errors.preu.message}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="idcategoria">
            ID categoria
          </label>
          <input
            id="idcategoria"
            type="number"
            min="1"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
            placeholder="1"
            {...register('idcategoria', {
              valueAsNumber: true,
              required: 'La categoria es obligatoria',
              min: { value: 1, message: 'Introdueix un identificador vàlid' },
            })}
          />
          {errors.idcategoria ? (
            <p className="mt-1 text-sm text-red-300">{errors.idcategoria.message}</p>
          ) : null}
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-stone-200">Disponible</span>
        <div className="mt-2 flex gap-4 text-sm text-stone-200">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              value="true"
              {...register('disponible', { setValueAs: (value) => value === 'true' })}
              defaultChecked
            />
            Disponible
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              value="false"
              {...register('disponible', { setValueAs: (value) => value === 'true' })}
            />
            Agotado
          </label>
        </div>
      </div>

      <button className="button-primary w-full md:w-auto" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Insertant...' : 'Insertar producte'}
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

export default InsertProductForm
