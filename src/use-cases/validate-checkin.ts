import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { CheckIn } from '@prisma/client'
import { ResouceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

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

    const distanceInMsFromCheckCreation =
      dayjs(new Date()).diff(dayjs(checkIn.created_at), 'minute') * 60 * 1000

    if (distanceInMsFromCheckCreation > 20 * 60 * 1000) {
      throw new LateCheckInValidationError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
