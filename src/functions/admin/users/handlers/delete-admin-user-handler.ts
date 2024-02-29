import { formatJSONResponse } from '@libs/api-gateway'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { deleteAdminUser } from '@/domain/admin-users/api/delete-admin-user'
import createHttpError from 'http-errors'

/**
 * 削除
 */
export const deleteAdminUserHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const adminUserId = event.pathParameters?.id
  if (adminUserId == null) {
    throw new createHttpError.BadRequest()
  }

  await deleteAdminUser(adminUserId)
  return formatJSONResponse({})
})
