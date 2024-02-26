import { fetchAdminUserByToken } from '@/domain/admin-users/api/fetch-admin-user-by-token'
import { type AdminApiContext } from '@libs/lambda'
import type middy from '@middy/core'
import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import createHttpError from 'http-errors'

/**
 * 認証ミドルウェア
 */
export const adminAuthenticateMiddleware = {
  before: async (handler: middy.Request<APIGatewayProxyEvent, APIGatewayProxyResult, Error, AdminApiContext>) => {
    const event = handler.event

    const authHeader = event.headers.Authorization || event.headers.authorization

    if (!authHeader) {
      throw new createHttpError.Unauthorized('Authorization header is missing')
    }

    const match = authHeader.match(/^Bearer (.*)$/)
    const token = match?.[1] ?? ''
    const adminUser = await fetchAdminUserByToken(token)
    if (adminUser == null) {
      throw new createHttpError.Unauthorized('Invalid token')
    }
    // handler.context.
  },
}
