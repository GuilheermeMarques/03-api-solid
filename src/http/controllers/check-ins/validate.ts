import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validadeCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validadeCheckInParamsSchema.parse(request.params)

  const validadeCheckInUseCase = makeValidateCheckInUseCase()

  await validadeCheckInUseCase.execute({
    checkInId,
  })

  return reply.status(204).send()
}
