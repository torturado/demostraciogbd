'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { randomChoice, randomInt, randomPassword, randomPhoneNumber, slugify } from '@/lib/random'

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

const clientFirstNames = ['Laia', 'Marc', 'Sofia', 'Hug', 'Clara', 'Pau', 'Aina', 'Jordi']

const clientLastNames = ['Martí', 'Llopis', 'Garcia', 'Soriano', 'Navarro', 'Costa', 'Ribas', 'Segarra']

const buildRandomClient = (): ClientFormValues => {
  const firstName = randomChoice(clientFirstNames)
  const lastName = `${randomChoice(clientLastNames)} ${randomChoice(clientLastNames)}`
  const nom = `${firstName} ${lastName}`
  const baseEmail = slugify(`${firstName}.${lastName}`)
  const email = `${baseEmail}${randomInt(1, 99)}@example.com`

  return {
    nom,
    email,
    telefon: randomPhoneNumber(),
    contrasenya: randomPassword(),
  }
}

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
        throw new Error(payload?.message ?? "No s'ha pogut inserir el client")
      }

      setSubmission({ status: 'success', message: 'Client inserit correctament.' })
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
    reset(buildRandomClient())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6" noValidate>
      <div>
        <label className="block text-sm font-medium" htmlFor="nom">
          Nom i cognoms
        </label>
        <input
          id="nom"
          type="text"
          className="mt-2"
          placeholder="Laia Martí"
          {...register('nom', {
            required: 'El nom és obligatori',
            minLength: { value: 3, message: 'Introdueix almenys 3 caràcters' },
          })}
        />
        {errors.nom ? (
          <p className="mt-1 text-sm text-destructive">{errors.nom.message}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium" htmlFor="email">
          Email de contacte
        </label>
        <input
          id="email"
          type="email"
          className="mt-2"
          placeholder="laura@example.com"
          {...register('email', {
            required: 'El correu electrònic és obligatori',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Introdueix un correu electrònic vàlid',
            },
          })}
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium" htmlFor="telefon">
            Telèfon
          </label>
          <input
            id="telefon"
            type="tel"
            className="mt-2"
            placeholder="612345678"
            {...register('telefon', {
              required: 'El telèfon és obligatori',
              minLength: { value: 9, message: 'Introdueix 9 dígits' },
            })}
          />
          {errors.telefon ? (
            <p className="mt-1 text-sm text-destructive">{errors.telefon.message}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="contrasenya">
            Contrasenya
          </label>
          <input
            id="contrasenya"
            type="password"
            className="mt-2"
            placeholder="•••••••"
            {...register('contrasenya', {
              required: 'La contrasenya és obligatòria',
              minLength: { value: 6, message: 'Mínim 6 caràcters' },
            })}
          />
          {errors.contrasenya ? (
            <p className="mt-1 text-sm text-destructive">{errors.contrasenya.message}</p>
          ) : null}
        </div>
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
          {isSubmitting ? 'Insertant...' : 'Inserir client'}
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

export default InsertClientForm
