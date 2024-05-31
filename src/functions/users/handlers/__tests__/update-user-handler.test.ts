import { supabaseClient } from '@libs/supabase/api-client'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareUser } from '@libs/jest/user-utils'
import { prepareUserToken } from '@libs/jest/auth-utils'
import { updateUserHandler } from '../update-user-handler'
import { type AppApiContext } from '@libs/lambda'
import { type User } from '@/domain/users/user'

describe('updateUserhHandler', () => {
  beforeEach(async () => {
    await supabaseClient().from('tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  test('更新処理が成功すること', async () => {
    const user = await prepareUser({})
    const token = await prepareUserToken(user)

    const result = await updateUserHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParameters: {
          id: user.id,
        },
        body: {
          name: 'test',
          loginId: 'updated_login_id',
          email: 'test@example.com',
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as AppApiContext,
    )
    const { statusCode } = parseHandlerJsonResponse<{ data: User }>(result)

    expect(statusCode).toBe(200)
  })

  test('自分以外のユーザーを更新できないこと', async () => {
    const user = await prepareUser({})
    const targetUser = await prepareUser({})
    const token = await prepareUserToken(user)

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
          email: 'test2@example.com',
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      {} as AppApiContext,
    )

    const { statusCode } = parseHandlerJsonResponse<{ data: User }>(result)

    expect(statusCode).toBe(403)
  })
})
