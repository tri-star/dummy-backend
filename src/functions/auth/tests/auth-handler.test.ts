import { supabase } from '@libs/supabase/api-client'
import { ulid } from 'ulid'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { type Context } from 'aws-lambda'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareUser } from '@libs/jest/user-utils'
import { loginHandler } from '../handler'

describe('auth-handler', () => {
  beforeEach(async () => {
    await supabase.from('tokens').delete().neq('id', '')
    await supabase.from('users').delete().neq('id', '')
  })

  describe('LoginHandler', () => {
    test('トークン発行が成功すること', async () => {
      const userId = ulid()
      const password = 'testtest'
      const user = await prepareUser({ userId, password })

      const result = await loginHandler(
        {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            loginId: user.loginId,
            password,
          }),
        } as unknown as VersionedApiGatewayEvent,
        undefined as unknown as Context,
      )

      const { statusCode, body } = parseHandlerJsonResponse<{ token: string }>(result)
      expect(statusCode).toBe(200)
      expect(body.token).toHaveLength(30)
    })

    test('認証に失敗した場合401レスポンスが返ること', async () => {
      const userId = ulid()
      const password = 'testtest'
      const wrongPassword = 'wrongPassword'
      const user = await prepareUser({ userId, password })

      const result = await loginHandler(
        {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            loginId: user.loginId,
            password: wrongPassword,
          }),
        } as unknown as VersionedApiGatewayEvent,
        undefined as unknown as Context,
      )

      const { statusCode, body } = parseHandlerJsonResponse<{ token: string }>(result)
      expect(body.token).toBeUndefined()
      expect(statusCode).toBe(401)
    })
  })
})
