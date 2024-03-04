import middy from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import { type Context as LambdaContext } from 'aws-lambda'
import { type AdminUserDetail } from '@/domain/admin-users/admin-user'
import { adminAuthenticateMiddleware } from '@/middlewares/admin-authenticate-middleware'
import httpErrorHandler from '@middy/http-error-handler'
import { type UserDetail } from '@/domain/users/user'
import { authenticateMiddleware } from '@/middlewares/authenticate-middleware'

/**
 * 管理者API内で利用するコンテキスト情報
 */
export type AdminApiContext = {
  adminUser?: AdminUserDetail
} & LambdaContext

/**
 * 一般ユーザーAPI内で利用するコンテキスト情報
 */
export type AppApiContext = {
  user?: UserDetail
} & LambdaContext

export const middyfy = (handler: Parameters<typeof middy>[0]) => {
  return middy(handler)
    .use(
      middyJsonBodyParser({
        disableContentTypeError: true,
      }),
    )
    .use(
      cors({
        origins: ['http://localhost:3000'],
        headers: 'Content-Type,Authorization',
        credentials: false,
      }),
    )
    .use(httpErrorHandler())
}

/**
 * 管理者用に認証を行うmiddleware
 */
export const middyfyWithAdminAuth = (handler: Parameters<typeof middy>[0]) => {
  return middyfy(handler).use(adminAuthenticateMiddleware).use(httpErrorHandler())
}

/**
 * 一般ユーザー用に認証を行うmiddleware
 */
export const middyfyWithAuth = (handler: Parameters<typeof middy>[0]) => {
  return middyfy(handler).use(authenticateMiddleware).use(httpErrorHandler())
}
