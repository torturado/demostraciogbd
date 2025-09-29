import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

type InsertProductBody = {
  nom?: unknown
  preu?: unknown
  idcategoria?: unknown
  disponible?: unknown
}

type ApiResponse = { message: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ message: 'Mètode no permès' })
  }

  const { nom, preu, idcategoria, disponible } = req.body as InsertProductBody

  const numericPrice = typeof preu === 'number' ? preu : Number(preu)
  const numericCategory = typeof idcategoria === 'number' ? idcategoria : Number(idcategoria)
  const hasAvailability = disponible !== undefined && disponible !== null
  const booleanAvailable =
    typeof disponible === 'boolean'
      ? disponible
      : disponible === 'true' || disponible === '1'

  if (
    typeof nom !== 'string' ||
    Number.isNaN(numericPrice) ||
    numericPrice < 0 ||
    Number.isNaN(numericCategory) ||
    numericCategory <= 0 ||
    !hasAvailability
  ) {
    return res.status(400).json({ message: 'Revisa les dades enviades al formulari.' })
  }

  try {
    await prisma.producte.create({
      data: {
        nom: nom.trim(),
        preu: numericPrice,
        idcategoria: numericCategory,
        disponible: booleanAvailable,
      },
    })

    return res.status(201).json({ message: 'Producte inserit correctament.' })
  } catch (error) {
    console.error('[insert-product] Error en crear el producte:', error)
    return res.status(500).json({ message: "No s'ha pogut inserir el producte." })
  }
}
