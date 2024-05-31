import { prepareUserToken } from '@libs/jest/auth-utils'
import { prepareUser } from '@libs/jest/user-utils'
import { supabaseClient } from '@libs/supabase/api-client'
import { fetchUserHandler } from '../fetch-user-handler'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { type User } from '@/domain/users/user'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { type AppApiContext } from '@libs/lambda'

describe('FetchUser', () => {
  beforeEach(async () => {
    await supabaseClient().from('tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  test('ユーザーを取得できること', async () => {
    const user = await prepareUser({})
    const token = await prepareUserToken(user)

    const response = await fetchUserHandler(
      {
        pathParameters: { id: user.id },
        headers: { Authorization: `Bearer ${token}` },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      {} as AppApiContext,
    )

    const { statusCode, body } = parseHandlerJsonResponse<{ success: boolean; data: User }>(response)
    expect(statusCode).toBe(200)
    expect(body?.data.id).toBe(user.id)
    expect(body?.success).toBe(true)
  })

  test('自分以外のユーザーは取得できないこと', async () => {
    const user = await prepareUser({})
    const token = await prepareUserToken(user)
    const targetUser = await prepareUser({})

    const response = await fetchUserHandler(
      {
        pathParameters: { id: targetUser.id },
        headers: { Authorization: `Bearer ${token}` },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      {} as AppApiContext,
    )

    const { statusCode } = parseHandlerJsonResponse<{ success: boolean; data: User }>(response)
    expect(statusCode).toBe(403)
  })
})
