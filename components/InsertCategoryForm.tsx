'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { randomChoice } from '@/lib/random'

type CategoryFormValues = {
  nom: string
}

type SubmissionState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

const defaultState: SubmissionState = { status: 'idle' }

const categoryDescriptors = [
  'Especialitat',
  'Selecció',
  'Clàssics',
  'Delícies',
  'Sabors',
  'Cuina',
]

const categoryGroups = ['de la casa', 'vegetarianes', 'de temporada', 'del xef', 'exprés', 'premium']

const buildRandomCategory = (): CategoryFormValues => {
  const descriptor = randomChoice(categoryDescriptors)
  const group = randomChoice(categoryGroups)
  return {
    nom: `${descriptor} ${group}`,
  }
}

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
        throw new Error(payload?.message ?? "No s'ha pogut inserir la categoria")
      }

      setSubmission({ status: 'success', message: 'Categoria inserida correctament.' })
      reset()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "S'ha produït un error inesperat. Torna-ho a intentar."
      setSubmission({ status: 'error', message })
    }
  }

  const handleRandomFill = () => {
    setSubmission(defaultState)
    reset(buildRandomCategory())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6" noValidate>
      <div>
        <label className="block text-sm font-medium" htmlFor="nom-categoria">
          Nom de la categoria
        </label>
        <input
          id="nom-categoria"
          type="text"
          className="mt-2"
          placeholder="Carns"
          {...register('nom', {
            required: 'El nom és obligatori',
            minLength: { value: 3, message: 'Introdueix almenys 3 caràcters' },
          })}
        />
        {errors.nom ? <p className="mt-1 text-sm text-destructive">{errors.nom.message}</p> : null}
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <button
          type="button"
          className="button-primary w-full md:w-auto"
          onClick={handleRandomFill}
          disabled={isSubmitting}
        >
          Afegeix dades aleatòries
        </button>
        <button className="button-primary w-full md:w-auto" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Insertant...' : 'Inserir categoria'}
        </button>
      </div>

      {submission.status === 'success' ? (
        <p className="text-sm text-emerald-400">{submission.message}</p>
      ) : null}

      {submission.status === 'error' ? (
        <p className="text-sm text-destructive">{submission.message}</p>
      ) : null}
    </form>
  )
}

export default InsertCategoryForm
