import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

type InsertCategoriaBody = {
  nom?: unknown
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

  const { nom } = req.body as InsertCategoriaBody

  if (typeof nom !== 'string' || nom.trim().length < 3) {
    return res.status(400).json({ message: 'Introdueix un nom de categoria vàlid.' })
  }

  try {
    await prisma.categoria.create({
      data: {
        nom: nom.trim(),
      },
    })

    return res.status(201).json({ message: 'Categoria inserida correctament.' })
  } catch (error) {
    console.error('[insert-categoria] Error en crear la categoria:', error)
    return res.status(500).json({ message: 'No s\'ha pogut inserir la categoria.' })
  }
}
