'use client'

type TableRow = Record<string, string | number | boolean | null | undefined>

type QueryResultTableProps = {
  rows: TableRow[]
  title?: string
}

export function QueryResultTable({ rows, title }: QueryResultTableProps) {
  if (!rows.length) {
    return (
      <div className="card">
        <p className="text-sm text-muted-foreground">Encara no s'ha executat cap consulta.</p>
      </div>
    )
  }

  const headers = Object.keys(rows[0])

  return (
    <div className="card space-y-4 overflow-hidden">
      {title ? <h3 className="text-lg font-semibold text-foreground">{title}</h3> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border/60 text-left text-sm">
          <thead className="bg-background/70">
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-background/40' : 'bg-background/25'}>
                {headers.map((header) => (
                  <td key={header} className="px-4 py-3 text-sm text-foreground/90">
                    {formatValue(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function formatValue(value: TableRow[string]) {
  if (value === null || value === undefined) {
    return '—'
  }

  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No'
  }

  if (typeof value === 'string') {
    const isIsoDate = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)
    return isIsoDate ? new Date(value).toLocaleString('ca-ES') : value
  }

  return value
}

export default QueryResultTable
