import { GetUserMetricsUseCase } from '../get-user-metrics'
import { PrismaCheckInsRespository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeGetUserMetricsUseCase() {
  const checkInsRespository = new PrismaCheckInsRespository()
  const useCase = new GetUserMetricsUseCase(checkInsRespository)

  return useCase
}
