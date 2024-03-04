import { formatJSONResponse } from '@libs/api-gateway'
import { updateAdminUserSchema } from '@/domain/admin-users/admin-user'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { updateAdminUser } from '@/domain/admin-users/api/update-admin-user'
import createHttpError from 'http-errors'

/**
 * 編集
 */
export const updateAdminUserHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const adminUserId = event.pathParameters?.id
  const parseResult = updateAdminUserSchema.safeParse(event.body ?? '{}')
  if (adminUserId == null) {
    throw new createHttpError.BadRequest('idが指定されていません')
  }
  if (!parseResult.success) {
    console.error('updateAdminUserHandler error', parseResult.error.errors)
    throw new createHttpError.BadRequest()
  }

  const newData = parseResult.data

  await updateAdminUser(adminUserId, {
    name: newData.name,
    loginId: newData.loginId,
  })
  return formatJSONResponse({})
})
