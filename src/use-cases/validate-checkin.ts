import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

interface ValidadeCheckinUseCaseRequest {
  checkInId: string
}

interface ValidadeCheckinUseCaseResponse {
  checkIn: CheckIn
}

export class ValidadeCheckinUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidadeCheckinUseCaseRequest): Promise<ValidadeCheckinUseCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResouceNotFoundError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
