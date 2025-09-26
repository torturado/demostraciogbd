'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import type { ProductSummary } from '@/pages/api/products'

type OrderDetailFormValues = {
  idproducte: number
  quantitat: number
}

type OrderFormValues = {
  idclient: number
  data: string
  estado: string
  metode_pago: string
  detalls: OrderDetailFormValues[]
}

type SubmissionState =
  | { status: 'idle' }
  | { status: 'success'; message: string }
  | { status: 'error'; message: string }

const defaultState: SubmissionState = { status: 'idle' }

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value)

const buildDetail = (productId?: number): OrderDetailFormValues => ({
  idproducte: productId ?? 0,
  quantitat: 1,
})

export function InsertOrderForm() {
  const [submission, setSubmission] = useState<SubmissionState>(defaultState)
  const [products, setProducts] = useState<ProductSummary[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [productsError, setProductsError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    defaultValues: {
      estado: 'en proceso',
      metode_pago: 'tarjeta',
      detalls: [buildDetail()],
    },
  })

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'detalls',
  })

  useEffect(() => {
    let cancelled = false

    const fetchProducts = async () => {
      setLoadingProducts(true)
      setProductsError(null)
      try {
        const response = await fetch('/api/products')
        const payload = (await response.json()) as { products?: ProductSummary[]; message?: string }

        if (!response.ok) {
          throw new Error(payload.message ?? 'No se pudo obtener la lista de productos')
        }

        if (!cancelled) {
          setProducts(payload.products ?? [])
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : 'Error inesperado al cargar los productos'
          setProductsError(message)
        }
      } finally {
        if (!cancelled) {
          setLoadingProducts(false)
        }
      }
    }

    fetchProducts()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!products.length) {
      return
    }

    const currentValues = getValues()
    const defaultProductId = products[0].id

    if (!currentValues.detalls || currentValues.detalls.length === 0) {
      replace([buildDetail(defaultProductId)])
      return
    }

    const shouldUpdate = currentValues.detalls.some((detail) => !detail.idproducte || detail.idproducte === 0)

    if (shouldUpdate) {
      const updated = currentValues.detalls.map((detail) =>
        detail.idproducte && detail.idproducte !== 0
          ? detail
          : { ...detail, idproducte: defaultProductId },
      )
      replace(updated)
    }
  }, [products, getValues, replace])

  const productMap = useMemo(() => {
    const map = new Map<number, ProductSummary>()
    products.forEach((product) => {
      map.set(product.id, product)
    })
    return map
  }, [products])

  const details = watch('detalls') ?? []

  const detailSummaries = details.map((detail) => {
    const product = productMap.get(detail.idproducte)
    const quantity = Number.isFinite(detail.quantitat) ? detail.quantitat : 0
    const price = product?.preu ?? 0
    const subtotal = price * quantity
    return {
      product,
      quantity,
      subtotal,
    }
  })

  const computedTotal = detailSummaries.reduce((acc, detail) => acc + detail.subtotal, 0)

  const onSubmit = async (values: OrderFormValues) => {
    setSubmission({ status: 'idle' })

    try {
      const response = await fetch('/api/insert-pedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      const payload: { message?: string; total?: number } = await response.json()

      if (!response.ok) {
        throw new Error(payload?.message ?? 'No se pudo insertar el pedido')
      }

      const successMessage =
        typeof payload.total === 'number'
          ? `Pedido insertado correctamente. Total calculado: ${formatCurrency(payload.total)}`
          : 'Pedido insertado correctamente.'

      setSubmission({ status: 'success', message: successMessage })

      reset({
        idclient: undefined as unknown as number,
        data: '',
        estado: 'en proceso',
        metode_pago: 'tarjeta',
        detalls: products.length ? [buildDetail(products[0].id)] : [buildDetail()],
      })
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ha ocurrido un error inesperado. Inténtalo de nuevo.'
      setSubmission({ status: 'error', message })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="pedido-idclient">
            ID cliente
          </label>
          <input
            id="pedido-idclient"
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
          <label className="block text-sm font-medium text-stone-200" htmlFor="pedido-data">
            Fecha del pedido
          </label>
          <input
            id="pedido-data"
            type="date"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
            {...register('data', {
              required: 'La fecha es obligatoria',
            })}
          />
          {errors.data ? <p className="mt-1 text-sm text-red-300">{errors.data.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="estado-pedido">
            Estado
          </label>
          <select
            id="estado-pedido"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 focus:border-red-500 focus:outline-none"
            {...register('estado', {
              required: 'El estado es obligatorio',
            })}
          >
            <option value="en proceso">En proceso</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
          {errors.estado ? <p className="mt-1 text-sm text-red-300">{errors.estado.message}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-200" htmlFor="metode_pago">
            Método de pago
          </label>
          <select
            id="metode_pago"
            className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 focus:border-red-500 focus:outline-none"
            {...register('metode_pago', {
              required: 'El método de pago es obligatorio',
            })}
          >
            <option value="tarjeta">Tarjeta</option>
            <option value="efectivo">Efectivo</option>
            <option value="bizum">Bizum</option>
          </select>
          {errors.metode_pago ? (
            <p className="mt-1 text-sm text-red-300">{errors.metode_pago.message}</p>
          ) : null}
        </div>

        <div className="flex items-end">
          <p className="w-full rounded-lg border border-stone-700/60 bg-stone-900/50 px-3 py-2 text-sm text-stone-300">
            Total estimado: <span className="font-semibold text-red-300">{formatCurrency(computedTotal)}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-stone-100">Detalle del pedido</h3>
          <button
            type="button"
            className="button-primary"
            onClick={() => append(buildDetail(products[0]?.id))}
            disabled={products.length === 0}
          >
            Añadir producto
          </button>
        </div>

        {productsError ? (
          <div className="card border border-red-500/40 text-sm text-red-200">
            <p>{productsError}</p>
          </div>
        ) : null}

        {loadingProducts ? (
          <div className="card text-sm text-stone-300">Cargando productos...</div>
        ) : null}

        {!loadingProducts && products.length === 0 ? (
          <div className="card text-sm text-stone-300">
            No hay productos registrados todavía. Crea categorías y productos antes de generar pedidos.
          </div>
        ) : null}

        <div className="space-y-4">
          {fields.map((field, index) => {
            const detailError = errors.detalls?.[index]
            const summary = detailSummaries[index]
            const price = summary?.product?.preu ?? 0

            return (
              <div key={field.id} className="rounded-xl border border-stone-700/60 bg-stone-900/50 p-4">
                <div className="flex items-center justify-between text-sm text-stone-400">
                  <span>Producto #{index + 1}</span>
                  {fields.length > 1 ? (
                    <button
                      type="button"
                      className="text-red-300 hover:text-red-200"
                      onClick={() => remove(index)}
                    >
                      Eliminar
                    </button>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <label
                      className="block text-sm font-medium text-stone-200"
                      htmlFor={`detalls-${index}-idproducte`}
                    >
                      Producto
                    </label>
                    <select
                      id={`detalls-${index}-idproducte`}
                      className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 focus:border-red-500 focus:outline-none"
                      defaultValue={field.idproducte}
                      {...register(`detalls.${index}.idproducte` as const, {
                        valueAsNumber: true,
                        required: 'Selecciona un producto',
                        min: { value: 1, message: 'Selecciona un producto válido' },
                      })}
                    >
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.nom} {product.categoria ? `(${product.categoria})` : ''}
                        </option>
                      ))}
                    </select>
                    {detailError?.idproducte ? (
                      <p className="mt-1 text-sm text-red-300">{detailError.idproducte.message}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium text-stone-200"
                      htmlFor={`detalls-${index}-quantitat`}
                    >
                      Cantidad
                    </label>
                    <input
                      id={`detalls-${index}-quantitat`}
                      type="number"
                      min="1"
                      className="mt-2 w-full rounded-lg border border-stone-600 bg-stone-950/60 px-3 py-2 text-stone-100 placeholder:text-stone-500 focus:border-red-500 focus:outline-none"
                      placeholder="2"
                      defaultValue={field.quantitat}
                      {...register(`detalls.${index}.quantitat` as const, {
                        valueAsNumber: true,
                        required: 'Obligatorio',
                        min: { value: 1, message: 'Al menos una unidad' },
                      })}
                    />
                    {detailError?.quantitat ? (
                      <p className="mt-1 text-sm text-red-300">{detailError.quantitat.message}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-sm text-stone-400">
                      Precio unitario: <span className="text-stone-200">{formatCurrency(price)}</span>
                    </p>
                    <p className="text-sm text-stone-400">
                      Subtotal calculado:{' '}
                      <span className="text-red-300">{formatCurrency(summary?.subtotal ?? 0)}</span>
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button className="button-primary w-full md:w-auto" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Insertando...' : 'Insertar pedido'}
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

export default InsertOrderForm
