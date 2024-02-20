import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

import { RegisterUseCase } from '@/use-cases/register'

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
    const prismaUserRespository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUserRespository)
    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (err) {
    return reply.status(406).send()
  }

  return reply.status(201).send()
}
