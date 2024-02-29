import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const prismaUserRespository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(prismaUserRespository)

  return registerUseCase
}
