import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { type AdminUser } from '@/domain/admin-users/admin-user'
import { updateAdminUserHandler } from '../update-admin-user-handler'

describe('updateAdminUserhHandler', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
  })

  test('更新処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)
    const targetUser = await prepareAdminUser({
      loginId: 'target_user',
    })

    const result = await updateAdminUserHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParameters: {
          id: targetUser.id,
        },
        body: {
          name: 'test',
          loginId: 'updated_login_id',
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as Context,
    )
    const { statusCode } = parseHandlerJsonResponse<{ data: AdminUser }>(result)

    expect(statusCode).toBe(200)
  })
})
