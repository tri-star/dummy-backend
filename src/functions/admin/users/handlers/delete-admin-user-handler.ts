import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { deleteAdminUser } from '@/domain/admin-users/api/delete-admin-user'

/**
 * 削除
 */
export const deleteAdminUserHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const adminUserId = event.pathParameters?.id
  if (adminUserId == null) {
    console.error('deleteAdminUserHandler error', 'adminUserId is null')
    return formatJSONUserErrorResponse({ errors: ['adminUserId is null'] })
  }

  try {
    await deleteAdminUser(adminUserId)
    return formatJSONResponse({})
  } catch (e) {
    console.error('deleteAdminUserHandler error', e)
    return formatJSONUserErrorResponse({ errors: ['ユーザー削除に失敗しました'] })
  }
})
