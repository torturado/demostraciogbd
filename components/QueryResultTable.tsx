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
        <p className="text-sm text-stone-300">Encara no s'ha executat cap consulta.</p>
      </div>
    )
  }

  const headers = Object.keys(rows[0])

  return (
    <div className="card space-y-3 overflow-hidden">
      {title ? <h3 className="text-lg font-semibold text-stone-100">{title}</h3> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-800 text-left text-sm">
          <thead className="bg-stone-900/80">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 font-medium uppercase tracking-wide text-red-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/70">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="odd:bg-stone-900/40">
                {headers.map((header) => (
                  <td key={header} className="px-4 py-2 text-stone-200">
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
