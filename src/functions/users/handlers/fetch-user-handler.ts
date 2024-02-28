import { fetchUser } from '@/domain/users/api/fetch-user'
import { BadRequestError } from '@/errors/bad-request'
import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { middyfyWithAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'

/**
 * ユーザー取得
 */
export const fetchUserHandler = middyfyWithAuth(async (event: APIGatewayProxyEvent) => {
  try {
    const userId = event.pathParameters?.id
    if (userId == null) {
      throw new BadRequestError('userId is required')
    }

    const userResponse = await fetchUser(userId)
    return formatJSONResponse({
      success: true,
      data: userResponse,
    })
  } catch (e) {
    console.error(e)
    return formatJSONUserErrorResponse({ error: e })
  }
})
