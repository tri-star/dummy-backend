import { supabase } from '@libs/supabase/api-client'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { type AdminUser } from '@/domain/admin-users/admin-user'
import { prepareUser } from '@libs/jest/user-utils'
import { prepareUserToken } from '@libs/jest/auth-utils'
import { updateUserHandler } from '../update-user-handler'
import { type AppApiContext } from '@libs/lambda'

describe('updateUserhHandler', () => {
  beforeEach(async () => {
    await supabase.from('tokens').delete().neq('id', '')
    await supabase.from('users').delete().neq('id', '')
  })

  test('更新処理が成功すること', async () => {
    const user = await prepareUser({})
    const token = await prepareUserToken(user)
    const targetUser = await prepareUser({
      loginId: 'target_user',
    })

    const result = await updateUserHandler(
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
          email: 'test@example.com',
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as AppApiContext,
    )
    const { statusCode } = parseHandlerJsonResponse<{ data: AdminUser }>(result)

    expect(statusCode).toBe(200)
  })
})
