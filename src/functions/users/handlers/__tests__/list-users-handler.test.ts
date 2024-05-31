import { supabaseClient } from '@libs/supabase/api-client'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareUser, prepareUsers } from '@libs/jest/user-utils'
import { prepareUserToken } from '@libs/jest/auth-utils'
import { type ListUsersResponse, listUsersHandler } from '../list-users-handler'
import { type AppApiContext } from '@libs/lambda'

describe('listUsersHandler', () => {
  beforeEach(async () => {
    await supabaseClient().from('tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  test('一覧を取得できること', async () => {
    const user = await prepareUser({})
    const token = await prepareUserToken(user)

    await prepareUsers({}, 10)

    const result = await listUsersHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      {} as unknown as AppApiContext,
    )

    const { statusCode, body } = parseHandlerJsonResponse<ListUsersResponse>(result)

    expect(statusCode).toBe(200)
    expect(body?.count).toBe(11)
  })
})
