import { SearchGymsUseCaseCase } from '../search-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeSearchGymsUseCase() {
  const gymsRespository = new PrismaGymsRepository()
  const useCase = new SearchGymsUseCaseCase(gymsRespository)

  return useCase
}
