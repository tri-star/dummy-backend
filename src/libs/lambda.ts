import middy from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'
import cors from '@middy/http-cors'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
