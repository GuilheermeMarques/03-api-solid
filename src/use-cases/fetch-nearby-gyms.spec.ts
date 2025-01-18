import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      descriptions: 'A melhor academia para programadores JavaScript',
      phone: null,
      latitude: -20.5381189,
      longitude: -48.5687296,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      descriptions: 'A melhor academia para programadores TypeScript',
      phone: null,
      latitude: -20.7106493,
      longitude: -48.5256606,
    })

    const { gyms } = await sut.execute({
      userLatitude: -20.5381189,
      userLongitude: -48.5687296,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
