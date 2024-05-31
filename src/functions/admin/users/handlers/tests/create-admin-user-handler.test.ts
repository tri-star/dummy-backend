import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { createAdminUserHandler } from '../create-admin-user-handler'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { type AdminUser } from '@/domain/admin-users/admin-user'

describe('createAdminUserhHandler', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
  })

  test('登録処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)

    const result = await createAdminUserHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          name: 'test',
          loginId: 'test',
          password: 'password',
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as Context,
    )
    const { statusCode, body } = parseHandlerJsonResponse<{ data: AdminUser }>(result)

    expect(statusCode).toBe(200)
    expect(body?.data.name).toBe('test')
  })
})
