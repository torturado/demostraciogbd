import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/lib/prisma'

type InsertReservaBody = {
  idclient?: unknown
  data?: unknown
  num_persones?: unknown
  estado?: unknown
}

type ApiResponse = { message: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ message: 'Método no permitido' })
  }

  const { idclient, data, num_persones, estado } = req.body as InsertReservaBody

  const numericClient = typeof idclient === 'number' ? idclient : Number(idclient)
  const numericPeople = typeof num_persones === 'number' ? num_persones : Number(num_persones)
  const dateValue = typeof data === 'string' ? new Date(data) : undefined

  if (
    Number.isNaN(numericClient) ||
    Number.isNaN(numericPeople) ||
    !(dateValue instanceof Date && !Number.isNaN(dateValue.valueOf())) ||
    typeof estado !== 'string'
  ) {
    return res.status(400).json({ message: 'Revisa los datos enviados en el formulario.' })
  }

  try {
    await prisma.reserva.create({
      data: {
        idclient: numericClient,
        data: dateValue,
        num_persones: numericPeople,
        estado: estado.trim(),
      },
    })

    return res.status(201).json({ message: 'Reserva insertada correctamente.' })
  } catch (error) {
    console.error('[insert-reserva] Error al crear la reserva:', error)
    return res.status(500).json({ message: 'No se pudo insertar la reserva.' })
  }
}
