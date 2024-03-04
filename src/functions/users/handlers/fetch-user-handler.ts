import { fetchUser } from '@/domain/users/api/fetch-user'
import { canFetch } from '@/domain/users/user-policy'
import { formatJSONResponse } from '@libs/api-gateway'
import { type AppApiContext, middyfyWithAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'

/**
 * ユーザー取得
 */
export const fetchUserHandler = middyfyWithAuth(async (event: APIGatewayProxyEvent, context: AppApiContext) => {
  const userId = event.pathParameters?.id
  if (userId == null) {
    throw createHttpError.BadRequest()
  }

  const userResponse = await fetchUser(userId)
  if (userResponse == null) {
    throw createHttpError.NotFound()
  }

  if (!canFetch(context.user, userResponse)) {
    throw createHttpError.Forbidden()
  }

  return formatJSONResponse({
    success: true,
    data: userResponse,
  })
})
