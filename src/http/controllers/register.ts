import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerBodyShema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  })

  const { name, email, password } = registerBodyShema.parse(request.body)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password,
    },
  })

  return reply.status(201).send()
}
