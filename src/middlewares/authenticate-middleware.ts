import { fetchAdminUserByToken } from '@/domain/admin-users/api/fetch-admin-user-by-token'
import { type AdminApiContext } from '@libs/lambda'
import type middy from '@middy/core'
import { type APIGatewayProxyEvent, type APIGatewayProxyResult } from 'aws-lambda'
import createHttpError from 'http-errors'
// import httpErrorHandler from '@middy/http-error-handler'

/**
 * 認証ミドルウェア
 */
export const authenticateMIddleware = {
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

    handler.context.adminUser = adminUser
  },
}

// export const middlewareAuthenticate = async (_: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   // トークンが有効な場合の処理をここに書く
//   return {
//     statusCode: 200,
//     body: JSON.stringify({ message: 'Authorized access' }),
//   }
// }

// // Middyを使用してミドルウェアを適用
// export const lambdaHandler = middy(handler).use(checkAuthMiddleware).use(httpErrorHandler()) // エラーハンドリングのためのミドルウェア
