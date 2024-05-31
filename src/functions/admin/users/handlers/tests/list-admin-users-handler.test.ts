import { supabaseClient } from '@libs/supabase/api-client'
import {
  type ListAdminUsersResponse,
  listAdminUsersHandler,
} from '@/functions/admin/users/handlers/list-admin-users-handler'
import { prepareAdminUser, prepareAdminUsers } from '@libs/jest/admin-user-utils'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'

describe('listAdminUsersHandler', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
  })

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
    expect(body?.count).toBe(11)
  })
})
