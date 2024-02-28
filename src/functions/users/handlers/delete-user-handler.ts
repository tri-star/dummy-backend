import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { middyfyWithAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { deleteUser } from '@/domain/users/api/delete-user'

/**
 * 削除
 */
export const deleteUserHandler = middyfyWithAuth(async (event: APIGatewayProxyEvent) => {
  const userId = event.pathParameters?.id
  if (userId == null) {
    console.error('deleteUserHandler error', 'userId is null')
    return formatJSONUserErrorResponse({ errors: ['userId is null'] })
  }

  try {
    await deleteUser(userId)
    return formatJSONResponse({})
  } catch (e) {
    console.error('deleteUserHandler error', e)
    return formatJSONUserErrorResponse({ errors: ['ユーザー削除に失敗しました'] })
  }
})
