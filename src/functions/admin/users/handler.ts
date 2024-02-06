import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { createAdminUser } from '@/domain/admin-users/api/admin-user-api'
import { type CreateAdminUser, createAdminPasswordHash, createAdminUserSchema } from '@/domain/admin-users/admin-user'
import { ulid } from 'ulid'

type CreateAdminUserNoAuthPayload = CreateAdminUser

/**
 * 登録(管理者用で、登録にトークンが不要)
 */
export const createAdminUserNoAuthHandler = async (event: CreateAdminUserNoAuthPayload) => {
  const parseResult = createAdminUserSchema.safeParse(event)
  if (!parseResult.success) {
    console.error('createAdminUserNoAuthHandler error', parseResult.error.errors)
    return formatJSONUserErrorResponse({ errors: parseResult.error.errors })
  }

  const user = parseResult.data

  const userId = ulid()
  try {
    const hashedPassword = createAdminPasswordHash(user.password, userId)
    const createdUser = await createAdminUser(userId, {
      name: user.name,
      email: user.email,
      loginId: user.loginId,
      password: hashedPassword,
    })
    return formatJSONResponse({ data: createdUser })
  } catch (e) {
    console.error('createAdminUserNoAuthHandler error', e)
    return formatJSONUserErrorResponse({ errors: ['ユーザー登録に失敗しました'] })
  }
}
