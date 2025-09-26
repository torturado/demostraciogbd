import type { NextApiRequest, NextApiResponse } from 'next'
import { Decimal } from '@prisma/client/runtime/library'
import prisma from '@/lib/prisma'

type RawOrderDetail = {
  idproducte?: unknown
  quantitat?: unknown
}

type InsertPedidoBody = {
  idclient?: unknown
  data?: unknown
  estado?: unknown
  metode_pago?: unknown
  detalls?: RawOrderDetail[]
}

type ApiResponse = { message: string; total?: number }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ message: 'Método no permitido' })
  }

  const { idclient, data, estado, metode_pago, detalls } = req.body as InsertPedidoBody

  const numericClient = typeof idclient === 'number' ? idclient : Number(idclient)
  const dateValue = typeof data === 'string' ? new Date(data) : undefined

  if (
    Number.isNaN(numericClient) ||
    numericClient <= 0 ||
    !(dateValue instanceof Date && !Number.isNaN(dateValue.valueOf())) ||
    typeof estado !== 'string' ||
    typeof metode_pago !== 'string' ||
    !Array.isArray(detalls) ||
    detalls.length === 0
  ) {
    return res.status(400).json({ message: 'Revisa los datos enviados en el formulario.' })
  }

  const parsedDetails = detalls.map((detail) => {
    const numericProduct =
      typeof detail.idproducte === 'number' ? detail.idproducte : Number(detail.idproducte)
    const numericQuantity =
      typeof detail.quantitat === 'number' ? detail.quantitat : Number(detail.quantitat)

    if (
      Number.isNaN(numericProduct) ||
      numericProduct <= 0 ||
      Number.isNaN(numericQuantity) ||
      numericQuantity <= 0
    ) {
      throw new Error('Detalle inválido')
    }

    return {
      idproducte: numericProduct,
      quantitat: numericQuantity,
    }
  })

  const productIds = Array.from(new Set(parsedDetails.map((detail) => detail.idproducte)))

  try {
    const products = await prisma.producte.findMany({
      where: { idproducte: { in: productIds } },
    })

    if (products.length !== productIds.length) {
      return res.status(400).json({ message: 'Alguno de los productos seleccionados no existe.' })
    }

    const priceMap = new Map(products.map((product) => [product.idproducte, product.preu]))

    const detailData = parsedDetails.map((detail) => {
      const price = priceMap.get(detail.idproducte)
      if (!price) {
        throw new Error('Producto no encontrado')
      }

      const subtotal = price.mul(detail.quantitat)

      return {
        idproducte: detail.idproducte,
        quantitat: detail.quantitat,
        subtotal,
      }
    })

    const totalDecimal = detailData.reduce(
      (acc, detail) => acc.add(detail.subtotal),
      new Decimal(0),
    )

    await prisma.pedido.create({
      data: {
        idclient: numericClient,
        data: dateValue,
        estado: estado.trim(),
        metode_pago: metode_pago.trim(),
        total: totalDecimal,
        detalls: {
          create: detailData,
        },
      },
    })

    return res.status(201).json({
      message: 'Pedido insertado correctamente.',
      total: totalDecimal.toNumber(),
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Detalle inválido') {
      return res.status(400).json({ message: 'Revisa los datos de cada línea de pedido.' })
    }

    console.error('[insert-pedido] Error al crear el pedido:', error)
    return res.status(500).json({ message: 'No se pudo insertar el pedido.' })
  }
}
