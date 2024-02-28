import { prepareUserToken } from '@libs/jest/auth-utils'
import { prepareUser } from '@libs/jest/user-utils'
import { supabase } from '@libs/supabase/api-client'
import { fetchUserHandler } from '../fetch-user-handler'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { type User } from '@/domain/users/user'
import { parseHandlerJsonResponse } from '@/utils/jest'

describe('FetchUser', () => {
  beforeEach(async () => {
    await supabase.from('tokens').delete().neq('id', '')
    await supabase.from('users').delete().neq('id', '')
  })

  test('ユーザーを取得できること', async () => {
    const user = await prepareUser({})
    const token = await prepareUserToken(user)

    const response = await fetchUserHandler(
      {
        pathParameters: { id: user.id },
        headers: { Authorization: `Bearer ${token}` },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      {} as Context,
    )

    const { statusCode, body } = parseHandlerJsonResponse<{ success: boolean; data: User }>(response)
    expect(statusCode).toBe(200)
    expect(body.data.id).toBe(user.id)
    expect(body.success).toBe(true)
  })
})
