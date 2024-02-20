import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '@/use-cases/register'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

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
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(406).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
