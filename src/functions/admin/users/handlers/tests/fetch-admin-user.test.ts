import { supabase } from '@libs/supabase/api-client'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { type User } from '@/domain/users/user'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { fetchAdminUserHandler } from '../fetch-admin-user-handler'

describe('FetcAdminUser', () => {
  beforeEach(async () => {
    await supabase.from('admin_tokens').delete().neq('id', '')
    await supabase.from('admin_users').delete().neq('id', '')
  })

  test('ユーザーを取得できること', async () => {
    const user = await prepareAdminUser({})
    const token = await prepareAdminUserToken(user)

    const response = await fetchAdminUserHandler(
      {
        pathParameters: { id: user.id },
        headers: { Authorization: `Bearer ${token}` },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      {} as Context,
    )

    const { statusCode, body } = parseHandlerJsonResponse<{ success: boolean; data: User }>(response)
    expect(statusCode).toBe(200)
    expect(body?.data.id).toBe(user.id)
    expect(body?.success).toBe(true)
  })
})
