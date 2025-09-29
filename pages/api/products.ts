import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

export type ProductSummary = {
  id: number
  nom: string
  preu: number
  disponible: boolean
  categoria: string | null
}

export type ProductsResponse =
  | { products: ProductSummary[] }
  | { message: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductsResponse>,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ message: 'Mètode no permès' })
  }

  try {
    const products = await prisma.producte.findMany({
      orderBy: { nom: 'asc' },
      include: { categoria: true },
    })

    return res.status(200).json({
      products: products.map((product) => ({
        id: product.idproducte,
        nom: product.nom,
        preu: product.preu.toNumber(),
        disponible: product.disponible,
        categoria: product.categoria?.nom ?? null,
      })),
    })
  } catch (error) {
    console.error('[products] Error en obtenir els productes', error)
    return res.status(500).json({ message: "No s'ha pogut obtenir la llista de productes." })
  }
}
