import { fetchAdminUser } from '@/domain/admin-users/api/fetch-admin-user'
import { BadRequestError } from '@/errors/bad-request'
import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'

/**
 * ユーザー取得
 */
export const fetchAdminUserHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  try {
    const adminUserId = event.pathParameters?.id
    if (adminUserId == null) {
      throw new BadRequestError('userId is required')
    }

    const userResponse = await fetchAdminUser(adminUserId)
    return formatJSONResponse({
      success: true,
      data: userResponse,
    })
  } catch (e) {
    console.error(e)
    return formatJSONUserErrorResponse({ error: e })
  }
})
