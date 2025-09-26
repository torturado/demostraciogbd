import { Decimal } from '@prisma/client/runtime/library'

export type SerializableRow = Record<string, string | number | boolean | null>

export function serializeQueryRows(rows: Record<string, unknown>[]): SerializableRow[] {
  return rows.map((row) => {
    const result: SerializableRow = {}

    for (const [key, value] of Object.entries(row)) {
      if (value instanceof Date) {
        result[key] = value.toISOString()
      } else if (value instanceof Decimal) {
        result[key] = value.toNumber()
      } else if (typeof value === 'bigint') {
        result[key] = Number(value)
      } else if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
      ) {
        result[key] = value
      } else {
        result[key] = value == null ? null : JSON.stringify(value)
      }
    }

    return result
  })
}
