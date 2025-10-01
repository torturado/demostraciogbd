'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

import type { ProductSummary } from '@/pages/api/products'

import { randomChoice, randomDateTimeLocal, randomInt } from '@/lib/random'

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
  new Intl.NumberFormat('ca-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value)

const buildDetail = (productId?: number): OrderDetailFormValues => ({
  idproducte: productId ?? 0,
  quantitat: 1,
})

const orderStates: OrderFormValues['estado'][] = ['en proceso', 'entregado', 'cancelado']
const orderPaymentMethods: OrderFormValues['metode_pago'][] = ['tarjeta', 'efectivo', 'bizum']

const buildRandomOrder = (productList: ProductSummary[]): OrderFormValues => {
  const detailCount = Math.min(randomInt(1, Math.max(1, productList.length)), 3)
  const availableProducts = [...productList]
  const detalls: OrderDetailFormValues[] = []

  for (let index = 0; index < detailCount; index += 1) {
    const pool = availableProducts.length ? availableProducts : productList
    const product = randomChoice(pool)
    const position = availableProducts.findIndex((item) => item.id === product.id)
    if (position !== -1) {
      availableProducts.splice(position, 1)
    }
    detalls.push({
      idproducte: product.id,
      quantitat: randomInt(1, 4),
    })
  }

  return {
    idclient: randomInt(1, 50),
    data: randomDateTimeLocal(0, 14).slice(0, 10),
    estado: randomChoice(orderStates),
    metode_pago: randomChoice(orderPaymentMethods),
    detalls,
  }
}

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
          throw new Error(payload.message ?? "No s'ha pogut obtenir la llista de productes")
        }

        if (!cancelled) {
          setProducts(payload.products ?? [])
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : 'Error inesperat al carregar els productes'
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
        throw new Error(payload?.message ?? "No s'ha pogut inserir la comanda")
      }

      const successMessage =
        typeof payload.total === 'number'
          ? `Comanda inserida correctament. Total calculat: ${formatCurrency(payload.total)}`
          : 'Comanda inserida correctament.'

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
        error instanceof Error ? error.message : "S'ha produït un error inesperat. Torna-ho a intentar."
      setSubmission({ status: 'error', message })
    }
  }

  const handleRandomFill = () => {
    if (!products.length) {
      return
    }

    setSubmission(defaultState)
    const randomOrder = buildRandomOrder(products)
    reset(randomOrder)
    replace(randomOrder.detalls)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium" htmlFor="pedido-idclient">
            ID client
          </label>
          <input
            id="pedido-idclient"
            type="number"
            min="1"
            className="mt-2"
            placeholder="1"
            {...register('idclient', {
              valueAsNumber: true,
              required: 'El client és obligatori',
              min: { value: 1, message: 'Introdueix un identificador vàlid' },
            })}
          />
          {errors.idclient ? (
            <p className="mt-1 text-sm text-destructive">{errors.idclient.message}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="pedido-data">
            Data de la comanda
          </label>
          <input
            id="pedido-data"
            type="date"
            className="mt-2"
            {...register('data', {
              required: 'La data és obligatòria',
            })}
          />
          {errors.data ? <p className="mt-1 text-sm text-destructive">{errors.data.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="block text-sm font-medium" htmlFor="estado-pedido">
            Estat
          </label>
          <select
            id="estado-pedido"
            className="mt-2"
            {...register('estado', {
              required: "L'estat és obligatori",
            })}
          >
            <option value="en proceso">En procés</option>
            <option value="entregado">Entregat</option>
            <option value="cancelado">Cancel·lat</option>
          </select>
          {errors.estado ? <p className="mt-1 text-sm text-destructive">{errors.estado.message}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="metode_pago">
            Mètode de pagament
          </label>
          <select
            id="metode_pago"
            className="mt-2"
            {...register('metode_pago', {
              required: 'El mètode de pagament és obligatori',
            })}
          >
            <option value="tarjeta">Targeta</option>
            <option value="efectivo">Efectiu</option>
            <option value="bizum">Bizum</option>
          </select>
          {errors.metode_pago ? (
            <p className="mt-1 text-sm text-destructive">{errors.metode_pago.message}</p>
          ) : null}
        </div>

        <div className="flex items-end">
          <p className="w-full rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-sm text-muted-foreground">
            Total estimat: <span className="font-semibold text-primary">{formatCurrency(computedTotal)}</span>
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Detall de la comanda</h3>
          <button
            type="button"
            className="button-primary"
            onClick={() => append(buildDetail(products[0]?.id))}
            disabled={products.length === 0}
          >
            Afegeix producte
          </button>
        </div>

        {productsError ? (
          <div className="card border-destructive/50 text-sm text-destructive">
            <p>{productsError}</p>
          </div>
        ) : null}

        {loadingProducts ? (
          <div className="card text-sm text-muted-foreground">Carregant productes...</div>
        ) : null}

        {!loadingProducts && products.length === 0 ? (
          <div className="card text-sm text-muted-foreground">
            No hi ha productes registrats encara. Crea categories i productes abans de generar comandes.
          </div>
        ) : null}

        <div className="space-y-4">
          {fields.map((field, index) => {
            const detailError = errors.detalls?.[index]
            const summary = detailSummaries[index]
            const price = summary?.product?.preu ?? 0

            return (
              <div key={field.id} className="rounded-xl border border-border/70 bg-background/60 p-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Producte #{index + 1}</span>
                  {fields.length > 1 ? (
                    <button
                      type="button"
                      className="text-destructive hover:text-destructive/80"
                      onClick={() => remove(index)}
                    >
                      Elimina
                    </button>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <label
                      className="block text-sm font-medium"
                      htmlFor={`detalls-${index}-idproducte`}
                    >
                      Producte
                    </label>
                    <select
                      id={`detalls-${index}-idproducte`}
                      className="mt-2"
                      defaultValue={field.idproducte}
                      {...register(`detalls.${index}.idproducte` as const, {
                        valueAsNumber: true,
                        required: 'Selecciona un producte',
                        min: { value: 1, message: 'Selecciona un producte vàlid' },
                      })}
                    >
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.nom} {product.categoria ? `(${product.categoria})` : ''}
                        </option>
                      ))}
                    </select>
                    {detailError?.idproducte ? (
                      <p className="mt-1 text-sm text-destructive">{detailError.idproducte.message}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium"
                      htmlFor={`detalls-${index}-quantitat`}
                    >
                      Quantitat
                    </label>
                    <input
                      id={`detalls-${index}-quantitat`}
                      type="number"
                      min="1"
                      className="mt-2"
                      placeholder="2"
                      defaultValue={field.quantitat}
                      {...register(`detalls.${index}.quantitat` as const, {
                        valueAsNumber: true,
                        required: 'Obligatori',
                        min: { value: 1, message: 'Almenys una unitat' },
                      })}
                    />
                    {detailError?.quantitat ? (
                      <p className="mt-1 text-sm text-destructive">{detailError.quantitat.message}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-sm text-muted-foreground">
                      Preu unitari: <span className="text-foreground">{formatCurrency(price)}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Subtotal calculat:{' '}
                      <span className="text-primary/80">{formatCurrency(summary?.subtotal ?? 0)}</span>
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <button
          type="button"
          className="button-primary w-full md:w-auto"
          onClick={handleRandomFill}
          disabled={isSubmitting || products.length === 0 || loadingProducts}
          title={
            products.length === 0 ? 'Necessites productes per generar una comanda de prova' : undefined
          }
        >
          Afegeix dades aleatòries
        </button>
        <button className="button-primary w-full md:w-auto" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Inserint...' : 'Inserir comanda'}
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

export default InsertOrderForm
