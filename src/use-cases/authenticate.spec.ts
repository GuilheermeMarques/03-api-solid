import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
// sut = sistem under test (variável principal)
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('teste', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: 'teste',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should should not be able to authenticate with wrong email', async () => {
    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: 'teste',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('teste', 6),
    })

    expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
