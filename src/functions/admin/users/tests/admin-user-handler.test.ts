import { supabase } from '@libs/supabase/api-client'
import { type ListAdminUsersResponse, createAdminUserNoAuthHandler, listAdminUsersHandler } from '../handler'
import { prepareAdminUser, prepareAdminUsers } from '@libs/jest/admin-user-utils'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'

describe('admin-user-handler', () => {
  beforeEach(async () => {
    await supabase.from('admin_tokens').delete().neq('id', '')
    await supabase.from('admin_users').delete().neq('id', '')
  })

  describe('createAdminUserNoAuthHandler', () => {
    test('登録処理が成功すること', async () => {
      const result = await createAdminUserNoAuthHandler({
        name: 'test',
        loginId: 'test',
        password: 'testtest',
      })
      expect(result.statusCode).toBe(200)
    })
  })

  describe('listAdminUsersHandler', () => {
    test('一覧を取得できること', async () => {
      const adminUser = await prepareAdminUser({})
      const token = await prepareAdminUserToken(adminUser)

      await prepareAdminUsers({}, 10)

      const result = await listAdminUsersHandler(
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
        undefined as unknown as Context,
      )

      const { statusCode, body } = parseHandlerJsonResponse<ListAdminUsersResponse>(result)

      expect(statusCode).toBe(200)
      expect(body.count).toBe(11)
    })
  })
})
