import { formatJSONResponse } from '@libs/api-gateway'
import { type AppApiContext, middyfyWithAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { updateUserSchema } from '@/domain/users/user'
import { updateUser } from '@/domain/users/api/update-user'
import createHttpError from 'http-errors'
import { fetchUser } from '@/domain/users/api/fetch-user'
import { canUpdate } from '@/domain/users/user-policy'

/**
 * 編集
 */
export const updateUserHandler = middyfyWithAuth(async (event: APIGatewayProxyEvent, context: AppApiContext) => {
  const userId = event.pathParameters?.id
  const parseResult = updateUserSchema.safeParse(event.body ?? '{}')
  if (userId == null) {
    throw new createHttpError.BadRequest('userId is null')
  }
  if (!parseResult.success) {
    console.error(parseResult.error.errors)
    throw new createHttpError.BadRequest('')
  }

  const targetUser = await fetchUser(userId)
  if (targetUser == null) {
    throw new createHttpError.NotFound()
  }

  if (!canUpdate(context.user, targetUser)) {
    throw new createHttpError.Forbidden()
  }

  const newData = parseResult.data

  await updateUser(userId, {
    name: newData.name,
    loginId: newData.loginId,
    email: newData.email,
  })
  return formatJSONResponse({})
})
