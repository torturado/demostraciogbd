'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

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
        throw new Error(payload?.message ?? 'No se pudo insertar la reserva')
      }

      setSubmission({ status: 'success', message: 'Reserva insertada correctamente.' })
      reset({ estado: 'pendiente' })
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
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="idclient">
            ID cliente
          </label>
          <input
            id="idclient"
            type="number"
            min="1"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
            placeholder="1"
            {...register('idclient', {
              valueAsNumber: true,
              required: 'El cliente es obligatorio',
              min: { value: 1, message: 'Introduce un identificador válido' },
            })}
          />
          {errors.idclient ? (
            <p className="mt-1 text-sm text-red-300">{errors.idclient.message}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="data">
            Fecha y hora
          </label>
          <input
            id="data"
            type="datetime-local"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
            {...register('data', {
              required: 'La fecha es obligatoria',
            })}
          />
          {errors.data ? <p className="mt-1 text-sm text-red-300">{errors.data.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="num_persones">
            Número de personas
          </label>
          <input
            id="num_persones"
            type="number"
            min="1"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
            placeholder="4"
            {...register('num_persones', {
              valueAsNumber: true,
              required: 'El número de personas es obligatorio',
              min: { value: 1, message: 'Debe haber al menos una persona' },
            })}
          />
          {errors.num_persones ? (
            <p className="mt-1 text-sm text-red-300">{errors.num_persones.message}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="estado">
            Estado
          </label>
          <select
            id="estado"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 focus:border-red-500 focus:outline-none"
            {...register('estado', {
              required: 'El estado es obligatorio',
            })}
          >
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
          {errors.estado ? <p className="mt-1 text-sm text-red-300">{errors.estado.message}</p> : null}
        </div>
      </div>

      <button className="button-primary w-full md:w-auto" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Insertando...' : 'Insertar reserva'}
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

export default InsertReservationForm
