import { UsersRepository } from '@/repositories/interfaces/users-repository'
import { ResouceNotFoundError } from './errors/resource-not-found-error'
import { User } from '@prisma/client'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResouceNotFoundError()
    }

    return { user }
  }
}
