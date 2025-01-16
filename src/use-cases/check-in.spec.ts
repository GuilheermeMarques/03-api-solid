import { InMemoryCheckinsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { CheckinUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckinsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckinsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Academia JavaScript Gym',
      descriptions: 'A melhor academia para programadores',
      phone: '',
      latitude: -20.5381189,
      longitude: -48.5687296,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitute: -20.5381189,
      userLongitude: -48.5687296,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 8, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitute: -20.5381189,
      userLongitude: -48.5687296,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitute: -20.5381189,
        userLongitude: -48.5687296,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 8, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitute: -20.5381189,
      userLongitude: -48.5687296,
    })

    vi.setSystemTime(new Date(2022, 0, 9, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitute: -20.5381189,
      userLongitude: -48.5687296,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'Academia JavaScript Gym',
      descriptions: 'A melhor academia para programadores',
      phone: '',
      latitude: new Decimal(-20.7106493),
      longitude: new Decimal(-48.5256606),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitute: -20.5381189,
        userLongitude: -48.5687296,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
