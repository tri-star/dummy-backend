import { fetchAdminUser } from '@/domain/admin-users/api/fetch-admin-user'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'

/**
 * ユーザー取得
 */
export const fetchAdminUserHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const adminUserId = event.pathParameters?.id
  if (adminUserId == null) {
    throw new createHttpError.BadRequest()
  }

  const userResponse = await fetchAdminUser(adminUserId)
  return formatJSONResponse({
    success: true,
    data: userResponse,
  })
})
