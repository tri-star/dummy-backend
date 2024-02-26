import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { createAdminUser } from '@/domain/admin-users/api/admin-user-api'
import { createAdminPasswordHash, createAdminUserSchema } from '@/domain/admin-users/admin-user'
import { ulid } from 'ulid'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'

/**
 * 登録
 */
export const createAdminUserHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const parseResult = createAdminUserSchema.safeParse(event.body ?? '{}')
  if (!parseResult.success) {
    console.error('createAdminUserHandler error', parseResult.error.errors)
    return formatJSONUserErrorResponse({ errors: parseResult.error.errors })
  }

  const user = parseResult.data

  const userId = ulid()
  try {
    const hashedPassword = createAdminPasswordHash(user.password, userId)
    const createdUser = await createAdminUser(userId, {
      name: user.name,
      loginId: user.loginId,
      password: hashedPassword,
    })
    return formatJSONResponse({ data: createdUser })
  } catch (e) {
    console.error('createAdminUserHandler error', e)
    return formatJSONUserErrorResponse({ errors: ['ユーザー登録に失敗しました'] })
  }
})
