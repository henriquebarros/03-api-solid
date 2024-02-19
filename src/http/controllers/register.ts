import { FastifyRequest, FastifyReply } from 'fastify'
import { hash } from 'bcryptjs'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { registerUseCase } from '@/use-cases/register'

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerBodyShema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodyShema.parse(request.body)

  try {
    await registerUseCase({
      name,
      email,
      password,
    })
  } catch (err) {
    return reply.status(406).send()
  }

  return reply.status(201).send()
}
