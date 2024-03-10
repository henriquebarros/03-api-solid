import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'

export function makeGetUserProfileUseCase() {
  const usersRespository = new PrismaUsersRepository()
  const useCase = new GetUserProfileUseCase(usersRespository)

  return useCase
}
