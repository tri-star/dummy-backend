import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { ulid } from 'ulid'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { middyfyWithAuth } from '@libs/lambda'
import { createPasswordHash, createUserSchema } from '@/domain/users/user'
import { createUser } from '@/domain/users/api/user-api'

/**
 * 登録
 */
export const createUserHandler = middyfyWithAuth(async (event: APIGatewayProxyEvent) => {
  const parseResult = createUserSchema.safeParse(event.body ?? '{}')
  if (!parseResult.success) {
    console.error('createUserHandler error', parseResult.error.errors)
    return formatJSONUserErrorResponse({ errors: parseResult.error.errors })
  }

  const user = parseResult.data

  const userId = ulid()
  try {
    const hashedPassword = createPasswordHash(user.password, userId)
    const createdUser = await createUser(userId, {
      name: user.name,
      loginId: user.loginId,
      email: user.email,
      password: hashedPassword,
    })
    return formatJSONResponse({ data: createdUser })
  } catch (e) {
    console.error('createUserHandler error', e)
    return formatJSONUserErrorResponse({ errors: ['ユーザー登録に失敗しました'] })
  }
})
