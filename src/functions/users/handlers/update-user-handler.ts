import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { middyfyWithAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { updateUserSchema } from '@/domain/users/user'
import { updateUser } from '@/domain/users/api/update-user'

/**
 * 編集
 */
export const updateUserHandler = middyfyWithAuth(async (event: APIGatewayProxyEvent) => {
  const userId = event.pathParameters?.id
  const parseResult = updateUserSchema.safeParse(event.body ?? '{}')
  if (userId == null) {
    console.error('updateUserHandler error', 'userId is null')
    return formatJSONUserErrorResponse({ errors: ['userId is null'] })
  }
  if (!parseResult.success) {
    console.error('updateUserHandler error', parseResult.error.errors)
    return formatJSONUserErrorResponse({ errors: parseResult.error.errors })
  }

  const newData = parseResult.data

  try {
    await updateUser(userId, {
      name: newData.name,
      loginId: newData.loginId,
      email: newData.email,
    })
    return formatJSONResponse({})
  } catch (e) {
    console.error('updateUserHandler error', e)
    return formatJSONUserErrorResponse({ errors: ['ユーザー更新に失敗しました'] })
  }
})
