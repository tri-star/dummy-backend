import { formatJSONResponse } from '@libs/api-gateway'
import { type AppApiContext, middyfyWithAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { deleteUser } from '@/domain/users/api/delete-user'
import { canDelete } from '@/domain/users/user-policy'
import { fetchUser } from '@/domain/users/api/fetch-user'
import createHttpError from 'http-errors'

/**
 * 削除
 */
export const deleteUserHandler = middyfyWithAuth(async (event: APIGatewayProxyEvent, context: AppApiContext) => {
  const userId = event.pathParameters?.id
  if (userId == null) {
    console.error('userId is null')
    throw new createHttpError.BadRequest()
  }

  const targetUser = await fetchUser(userId)
  if (targetUser == null) {
    throw new createHttpError.NotFound()
  }

  if (!canDelete(context.user, targetUser)) {
    throw new createHttpError.Forbidden()
  }

  await deleteUser(userId)
  return formatJSONResponse({})
})
