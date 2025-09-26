'use client'

import { useState } from 'react'
import QueryResultTable from '@/components/QueryResultTable'

type QueryType =
  | 'clientes_reservas'
  | 'total_gastado'
  | 'clientes_sin_reservas'
  | 'categorias_productos'
  | 'productos_disponibles'
  | 'reservas_estado'
  | 'pedidos_resumen'
  | 'detalles_pedido'

type QueryConfig = {
  type: QueryType
  title: string
  description: string
}

type QueryResponse = {
  rows: Array<Record<string, string | number | boolean | null>>
}

const QUERIES: QueryConfig[] = [
  {
    type: 'clientes_reservas',
    title: 'Clientes con sus reservas',
    description:
      'Une las tablas client y reserva para ver cuántas personas asistirán y el estado de cada reserva.',
  },
  {
    type: 'total_gastado',
    title: 'Total gastado por cliente',
    description:
      'Agrupa pedidos por cliente y muestra el acumulado económico usando SUM sobre la columna total.',
  },
  {
    type: 'clientes_sin_reservas',
    title: 'Clientes sin reservas activas',
    description:
      'LEFT JOIN entre client y reserva filtrando los nulos para detectar usuarios sin reservas.',
  },
  {
    type: 'categorias_productos',
    title: 'Categorías con numero de productos',
    description:
      'LEFT JOIN entre categoria y producte para conocer cuántos artículos hay en cada categoría.',
  },
  {
    type: 'productos_disponibles',
    title: 'Productos disponibles hoy',
    description:
      'Listado de productos marcados como disponibles junto a su categoría y precio ordenados por nombre.',
  },
  {
    type: 'reservas_estado',
    title: 'Reservas por estado',
    description:
      'Agrupación de reservas mostrando cuántas hay por estado y el último registro creado.',
  },
  {
    type: 'pedidos_resumen',
    title: 'Resumen de pedidos',
    description:
      'Pedidos con total, método de pago y número de líneas usando joins con detall_pedido.',
  },
  {
    type: 'detalles_pedido',
    title: 'Detalle de pedidos',
    description:
      'Detalle granular de cada línea del pedido incluyendo nombre de producto y subtotal.',
  },
]

export default function QueriesPage() {
  const [activeQuery, setActiveQuery] = useState<QueryType | null>(null)
  const [loadingQuery, setLoadingQuery] = useState<QueryType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<QueryResponse['rows']>([])

  const runQuery = async (queryType: QueryType) => {
    setLoadingQuery(queryType)
    setError(null)

    try {
      const response = await fetch(`/api/queries?type=${queryType}`)
      const payload: QueryResponse & { message?: string } = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'No se pudo ejecutar la consulta')
      }

      setRows(payload.rows)
      setActiveQuery(queryType)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ha ocurrido un error inesperado'
      setError(message)
      setRows([])
      setActiveQuery(null)
    } finally {
      setLoadingQuery(null)
    }
  }

  const activeTitle = activeQuery
    ? QUERIES.find((query) => query.type === activeQuery)?.title
    : undefined

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-stone-100">Consultas predefinidas</h1>
        <p className="max-w-3xl text-stone-300">
          Pulsa sobre cualquiera de las consultas para lanzar la sentencia SQL preparada en el
          servidor. El resultado se muestra en la tabla inferior y puedes utilizarlo para explicar
          cómo funcionan los JOIN, las agregaciones y los filtros sobre la base de datos.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {QUERIES.map((query) => {
          const isLoading = loadingQuery === query.type
          const isActive = activeQuery === query.type

          return (
            <button
              key={query.type}
              className={`card text-left transition ${
                isActive ? 'border-red-500/80 text-red-500' : 'hover:border-red-500/40'
              }`}
              type="button"
              onClick={() => runQuery(query.type)}
              disabled={isLoading}
            >
              <h2 className="text-lg font-semibold text-stone-100">{query.title}</h2>
              <p className="mt-2 text-sm text-stone-300/80">{query.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-red-500">
                {isLoading ? 'Consultant…' : 'Executar consulta'}
                <span aria-hidden>↻</span>
              </span>
            </button>
          )
        })}
      </div>

      {error ? (
        <div className="card border-red-500/40 text-sm text-red-200">
          <p>{error}</p>
        </div>
      ) : null}

      <QueryResultTable rows={rows} title={activeTitle} />
    </div>
  )
}
