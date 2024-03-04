import { formatJSONResponse } from '@libs/api-gateway'
import { createAdminUser } from '@/domain/admin-users/api/create-admin-user'
import { type CreateAdminUser, createAdminPasswordHash, createAdminUserSchema } from '@/domain/admin-users/admin-user'
import { ulid } from 'ulid'
import createHttpError from 'http-errors'

type CreateAdminUserNoAuthPayload = CreateAdminUser

/**
 * 登録(管理者用で、登録にトークンが不要)
 */
export const createAdminUserNoAuthHandler = async (event: CreateAdminUserNoAuthPayload) => {
  const parseResult = createAdminUserSchema.safeParse(event)
  if (!parseResult.success) {
    console.error('createAdminUserNoAuthHandler error', parseResult.error.errors)
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
}
