import { PrismaCheckInsRespository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'

export function makeFetchUserCheckInsUseCase() {
  const checkInsRespository = new PrismaCheckInsRespository()
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRespository)

  return useCase
}
