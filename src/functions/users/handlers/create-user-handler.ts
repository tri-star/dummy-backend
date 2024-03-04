import { formatJSONResponse } from '@libs/api-gateway'
import { ulid } from 'ulid'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { middyfy } from '@libs/lambda'
import { createPasswordHash, createUserSchema } from '@/domain/users/user'
import { createUser } from '@/domain/users/api/create-user'
import createHttpError from 'http-errors'

/**
 * 登録
 */
export const createUserHandler = middyfy(async (event: APIGatewayProxyEvent) => {
  const parseResult = createUserSchema.safeParse(event.body ?? '{}')
  if (!parseResult.success) {
    console.error('createUserHandler error', parseResult.error.errors)
    throw new createHttpError.BadRequest()
  }

  const user = parseResult.data

  const userId = ulid()
  const hashedPassword = createPasswordHash(user.password, userId)
  const createdUser = await createUser(userId, {
    name: user.name,
    loginId: user.loginId,
    email: user.email,
    password: hashedPassword,
  })
  return formatJSONResponse({ data: createdUser })
})
