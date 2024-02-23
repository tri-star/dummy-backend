import middy from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'
import { type Context as LambdaContext } from 'aws-lambda'
import { type AdminUserDetail } from '@/domain/admin-users/admin-user'
import { authenticateMIddleware } from '@/middlewares/authenticate-middleware'

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
}

export const middyfyWithAdminAuth = (handler: Parameters<typeof middy>[0]) => {
  return middyfy(handler).use(authenticateMIddleware)
}

export type AdminApiContext = {
  adminUser?: AdminUserDetail
} & LambdaContext
