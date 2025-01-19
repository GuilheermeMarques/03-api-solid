import { GetUserMatricsUseCase } from '../get-user-matrics'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeGetUserMatricsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const useCase = new GetUserMatricsUseCase(checkInsRepository)

  return useCase
}
