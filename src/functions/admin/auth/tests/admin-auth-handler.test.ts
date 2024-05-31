import { supabaseClient } from '@libs/supabase/api-client'
import { adminLoginHandler } from '../handler'
import { ulid } from 'ulid'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { type Context } from 'aws-lambda'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'

describe('admin-auth-handler.test', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
  })

  describe('adminLoginHandler', () => {
    test('トークン発行が成功すること', async () => {
      const adminUserId = ulid()
      const password = 'testtest'
      const user = await prepareAdminUser({ adminUserId, password })

      const result = await adminLoginHandler(
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
      expect(body?.token).toHaveLength(30)
    })

    test('認証に失敗した場合401レスポンスが返ること', async () => {
      const adminUserId = ulid()
      const password = 'testtest'
      const wrongPassword = 'wrongPassword'
      const user = await prepareAdminUser({ adminUserId, password })

      const result = await adminLoginHandler(
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
      expect(body?.token).toBeUndefined()
      expect(statusCode).toBe(401)
    })
  })
})
