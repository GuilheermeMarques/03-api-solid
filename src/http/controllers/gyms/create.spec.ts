import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to create gym', async () => {
    const response = await request(app.server).post('/gyms').send({
      titlle: 'John Doe',
      descriptions: 'johndoe@example.com',
      phone: '123456',
      latitude: 0,
      longitude: 0,
    })

    expect(response.statusCode).toEqual(201)
  })
})
