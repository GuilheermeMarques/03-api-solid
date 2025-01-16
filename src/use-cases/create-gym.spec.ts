import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      descriptions: 'A melhor academia para programadores',
      phone: null,
      latitude: -20.5381189,
      longitude: -48.5687296,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
