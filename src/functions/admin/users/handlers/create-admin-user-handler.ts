import { formatJSONResponse } from '@libs/api-gateway'
import { createAdminUser } from '@/domain/admin-users/api/create-admin-user'
import { createAdminPasswordHash, createAdminUserSchema } from '@/domain/admin-users/admin-user'
import { ulid } from 'ulid'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'

/**
 * 登録
 */
export const createAdminUserHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const parseResult = createAdminUserSchema.safeParse(event.body ?? '{}')
  if (!parseResult.success) {
    console.error('createAdminUserHandler error', parseResult.error.errors)
    throw new createHttpError.BadRequest()
  }

  const user = parseResult.data

  const userId = ulid()
  const hashedPassword = createAdminPasswordHash(user.password, userId)
  const createdUser = await createAdminUser(userId, {
    name: user.name,
    loginId: user.loginId,
    password: hashedPassword,
  })
  return formatJSONResponse({ data: createdUser })
})
