'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { randomChoice, randomDateTimeLocal, randomInt } from '@/lib/random'

type ReservationFormValues = {
  idclient: number
  data: string
  num_persones: number
  estado: string
}

type SubmissionState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

const defaultState: SubmissionState = { status: 'idle' }

const reservationStates: ReservationFormValues['estado'][] = ['pendiente', 'confirmada', 'cancelada']

const buildRandomReservation = (): ReservationFormValues => {
  return {
    idclient: randomInt(1, 25),
    data: randomDateTimeLocal(0, 21),
    num_persones: randomInt(1, 8),
    estado: randomChoice(reservationStates),
  }
}

export function InsertReservationForm() {
  const [submission, setSubmission] = useState<SubmissionState>(defaultState)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormValues>({
    defaultValues: {
      estado: 'pendiente',
    },
  })

  const onSubmit = async (values: ReservationFormValues) => {
    setSubmission({ status: 'idle' })

    try {
      const response = await fetch('/api/insert-reserva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.message ?? "No s'ha pogut inserir la reserva")
      }

      setSubmission({ status: 'success', message: 'Reserva inserida correctament.' })
      reset({ estado: 'pendiente' })
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
    reset(buildRandomReservation())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="idclient">
            ID client
          </label>
          <input
            id="idclient"
            type="number"
            min="1"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
            placeholder="1"
            {...register('idclient', {
              valueAsNumber: true,
              required: 'El client és obligatori',
              min: { value: 1, message: 'Introdueix un identificador vàlid' },
            })}
          />
          {errors.idclient ? (
            <p className="mt-1 text-sm text-red-300">{errors.idclient.message}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="data">
            Data i hora
          </label>
          <input
            id="data"
            type="datetime-local"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
            {...register('data', {
              required: 'La data és obligatòria',
            })}
          />
          {errors.data ? <p className="mt-1 text-sm text-red-300">{errors.data.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="num_persones">
            Nombre de persones
          </label>
          <input
            id="num_persones"
            type="number"
            min="1"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
            placeholder="4"
            {...register('num_persones', {
              valueAsNumber: true,
              required: 'El nombre de persones és obligatori',
              min: { value: 1, message: "Hi ha d'haver almenys una persona" },
            })}
          />
          {errors.num_persones ? (
            <p className="mt-1 text-sm text-red-300">{errors.num_persones.message}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="estado">
            Estat
          </label>
          <select
            id="estado"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 focus:border-red-500 focus:outline-none"
            {...register('estado', {
              required: "L'estat és obligatori",
            })}
          >
            <option value="pendiente">Pendent</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancel·lada</option>
          </select>
          {errors.estado ? <p className="mt-1 text-sm text-red-300">{errors.estado.message}</p> : null}
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
          {isSubmitting ? 'Inserint...' : 'Inserir reserva'}
        </button>
      </div>

      {submission.status === 'success' ? (
        <p className="text-sm text-emerald-300">{submission.message}</p>
      ) : null}

      {submission.status === 'error' ? (
        <p className="text-sm text-red-300">{submission.message}</p>
      ) : null}
    </form>
  )
}

export default InsertReservationForm
