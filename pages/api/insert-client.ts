import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'

type InsertClientBody = {
  nom?: unknown
  email?: unknown
  telefon?: unknown
  contrasenya?: unknown
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

  const { nom, email, telefon, contrasenya } = req.body as InsertClientBody

  if (
    typeof nom !== 'string' ||
    typeof email !== 'string' ||
    typeof telefon !== 'string' ||
    typeof contrasenya !== 'string'
  ) {
    return res
      .status(400)
      .json({ message: 'Todos los campos son obligatorios y deben ser de tipo texto.' })
  }

  try {
    await prisma.client.create({
      data: {
        nom: nom.trim(),
        email: email.trim().toLowerCase(),
        telefon: telefon.trim(),
        contrasenya,
      },
    })

    return res.status(201).json({ message: 'Cliente insertado correctamente.' })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res
        .status(409)
        .json({ message: 'Este email ya está registrado. Prueba con otro correo.' })
    }

    console.error('[insert-client] Error al crear el cliente:', error)
    return res.status(500).json({ message: 'No se pudo insertar el cliente.' })
  }
}
