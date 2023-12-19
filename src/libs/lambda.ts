import middy from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const middyfy = (handler: Parameters<typeof middy>[0]) => {
  return middy(handler).use(middyJsonBodyParser())
}
