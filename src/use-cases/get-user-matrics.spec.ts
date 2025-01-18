import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { GetUserMatricsUseCase } from './get-user-matrics'

let checkInsRepository: InMemoryCheckinsRepository
let sut: GetUserMatricsUseCase

describe('Get User Matrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckinsRepository()
    sut = new GetUserMatricsUseCase(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
