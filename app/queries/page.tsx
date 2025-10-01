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
    title: 'Clients amb les seves reserves',
    description:
      "Uneix les taules client i reserva per veure quantes persones assistiran i l'estat de cada reserva.",
  },
  {
    type: 'total_gastado',
    title: 'Total gastat per client',
    description:
      "Agrupa comandes per client i mostra l'import acumulat utilitzant SUM sobre la columna total.",
  },
  {
    type: 'clientes_sin_reservas',
    title: 'Clients sense reserves actives',
    description:
      'LEFT JOIN entre client i reserva filtrant els nuls per detectar usuaris sense reserves.',
  },
  {
    type: 'categorias_productos',
    title: 'Categories amb nombre de productes',
    description:
      'LEFT JOIN entre categoria i producte per conèixer quants articles hi ha a cada categoria.',
  },
  {
    type: 'productos_disponibles',
    title: 'Productes disponibles avui',
    description:
      'Llistat de productes marcats com a disponibles amb la seva categoria i preu ordenats per nom.',
  },
  {
    type: 'reservas_estado',
    title: 'Reserves per estat',
    description:
      "Agrupació de reserves mostrant quantes n'hi ha per estat i l'últim registre creat.",
  },
  {
    type: 'pedidos_resumen',
    title: 'Resum de comandes',
    description:
      'Comandes amb total, mètode de pagament i número de línies utilitzant joins amb detall_pedido.',
  },
  {
    type: 'detalles_pedido',
    title: 'Detall de comandes',
    description:
      'Detall granular de cada línia de la comanda incloent el nom del producte i el subtotal.',
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
        throw new Error(payload.message ?? "No s'ha pogut executar la consulta")
      }

      setRows(payload.rows)
      setActiveQuery(queryType)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "S'ha produït un error inesperat"
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
    <div className="space-y-10">
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold text-foreground">Consultes predefinides</h1>
        <p className="max-w-3xl text-muted-foreground">
          Selecciona una consulta per executar la sentència SQL preparada al servidor. Els resultats es mostren sota en un
          format de taula perquè puguis explicar les joins, els filtres i les agregacions.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {QUERIES.map((query) => {
          const isLoading = loadingQuery === query.type
          const isActive = activeQuery === query.type

          return (
            <button
              key={query.type}
              className={`card text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isActive ? 'border-primary/70 shadow-glow' : 'hover:border-primary/50 hover:shadow-glow'
              }`}
              type="button"
              onClick={() => runQuery(query.type)}
              disabled={isLoading}
            >
              <h2 className="text-lg font-semibold text-foreground">{query.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{query.description}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
                {isLoading ? 'Consultant…' : 'Executar consulta'}
                <span aria-hidden>↻</span>
              </span>
            </button>
          )
        })}
      </div>

      {error ? (
        <div className="card border-destructive/50 text-sm text-destructive">
          <p>{error}</p>
        </div>
      ) : null}

      <QueryResultTable rows={rows} title={activeTitle} />
    </div>
  )
}
