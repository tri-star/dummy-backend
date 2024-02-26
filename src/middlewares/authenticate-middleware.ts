import { fetchUserByToken } from '@/domain/users/api/fetch-user-by-token'
import { type AppApiContext } from '@libs/lambda'
import type middy from '@middy/core'
import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import createHttpError from 'http-errors'

/**
 * 認証ミドルウェア
 */
export const authenticateMiddleware = {
  before: async (handler: middy.Request<APIGatewayProxyEvent, APIGatewayProxyResult, Error, AppApiContext>) => {
    const event = handler.event

    const authHeader = event.headers.Authorization || event.headers.authorization

    if (!authHeader) {
      throw new createHttpError.Unauthorized('Authorization header is missing')
    }

    const match = authHeader.match(/^Bearer (.*)$/)
    const token = match?.[1] ?? ''
    const user = await fetchUserByToken(token)
    if (user == null) {
      throw new createHttpError.Unauthorized('Invalid token')
    }
    handler.context.user = user
  },
}
