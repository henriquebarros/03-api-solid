import { FetchNearbyGymsUseCaseCase } from '../fetch-nearby-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeFetchNearbyGymsUseCase() {
  const gymsRespository = new PrismaGymsRepository()
  const useCase = new FetchNearbyGymsUseCaseCase(gymsRespository)

  return useCase
}
