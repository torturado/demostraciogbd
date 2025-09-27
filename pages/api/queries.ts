import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { serializeQueryRows, type SerializableRow } from '@/lib/serialization'

type QueryType =
  | 'clientes_reservas'
  | 'total_gastado'
  | 'clientes_sin_reservas'
  | 'categorias_productos'
  | 'productos_disponibles'
  | 'reservas_estado'
  | 'pedidos_resumen'
  | 'detalles_pedido'

type ApiResponse =
  | { rows: SerializableRow[] }
  | { message: string }

const PREPARED_QUERIES: Record<QueryType, Prisma.Sql> = {
  clientes_reservas: Prisma.sql`
    SELECT
      c.nom AS cliente,
      r.data AS fecha,
      r.num_persones AS personas,
      r.estado AS estado
    FROM client c
    INNER JOIN reserva r ON c.idclient = r.idclient
    ORDER BY r.data DESC
  `,
  total_gastado: Prisma.sql`
    SELECT
      c.nom AS cliente,
      SUM(p.total) AS total_gastado
    FROM client c
    INNER JOIN pedido p ON c.idclient = p.idclient
    GROUP BY c.nom
    ORDER BY total_gastado DESC
  `,
  clientes_sin_reservas: Prisma.sql`
    SELECT
      c.nom AS cliente,
      c.email AS email
    FROM client c
    LEFT JOIN reserva r ON c.idclient = r.idclient
    WHERE r.idreserva IS NULL
    ORDER BY c.nom
  `,
  categorias_productos: Prisma.sql`
    SELECT
      cat.nom AS categoria,
      COUNT(prod.idproducte) AS total_productos,
      SUM(CASE WHEN prod.disponible THEN 1 ELSE 0 END) AS disponibles
    FROM categoria cat
    LEFT JOIN producte prod ON cat.idcategoria = prod.idcategoria
    GROUP BY cat.idcategoria, cat.nom
    ORDER BY cat.nom
  `,
  productos_disponibles: Prisma.sql`
    SELECT
      prod.nom AS producto,
      prod.preu AS precio,
      cat.nom AS categoria,
      prod.disponible AS disponible
    FROM producte prod
    LEFT JOIN categoria cat ON prod.idcategoria = cat.idcategoria
    WHERE prod.disponible = TRUE
    ORDER BY cat.nom, prod.nom
  `,
  reservas_estado: Prisma.sql`
    SELECT
      r.estado AS estado,
      COUNT(*) AS total_reservas,
      MAX(r.data) AS ultima_reserva
    FROM reserva r
    GROUP BY r.estado
    ORDER BY total_reservas DESC
  `,
  pedidos_resumen: Prisma.sql`
    SELECT
      p.idpedido AS pedido,
      c.nom AS cliente,
      p.total AS total,
      p.metode_pago AS metodo_pago,
      p.estado AS estado,
      COUNT(d.iddetall) AS lineas
    FROM pedido p
    LEFT JOIN client c ON p.idclient = c.idclient
    LEFT JOIN detall_pedido d ON d.idpedido = p.idpedido
    GROUP BY p.idpedido, c.nom, p.total, p.metode_pago, p.estado
    ORDER BY p.idpedido DESC
  `,
  detalles_pedido: Prisma.sql`
    SELECT
      d.iddetall AS detalle,
      p.idpedido AS pedido,
      prod.nom AS producto,
      d.quantitat AS cantidad,
      d.subtotal AS subtotal
    FROM detall_pedido d
    LEFT JOIN pedido p ON d.idpedido = p.idpedido
    LEFT JOIN producte prod ON d.idproducte = prod.idproducte
    ORDER BY p.idpedido DESC, d.iddetall DESC
  `,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ message: 'Método no permitido' })
  }

  const typeParam = req.query.type
  const queryType = typeof typeParam === 'string' ? (typeParam as QueryType) : undefined

  if (!queryType || !(queryType in PREPARED_QUERIES)) {
    return res.status(400).json({ message: 'Parámetro type no reconocido' })
  }

  try {
    const rawRows = await prisma.$queryRaw<Record<string, unknown>[]>(
      PREPARED_QUERIES[queryType],
    )
    const rows = serializeQueryRows(rawRows)

    return res.status(200).json({ rows })
  } catch (error) {
    console.error('[queries] Error al ejecutar la consulta', error)
    return res.status(500).json({ message: 'No se pudo ejecutar la consulta solicitada.' })
  }
}
