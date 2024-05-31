import { supabaseClient } from '@libs/supabase/api-client'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareUser } from '@libs/jest/user-utils'
import { prepareUserToken } from '@libs/jest/auth-utils'
import { deleteUserHandler } from '../delete-user-handler'
import { type AppApiContext } from '@libs/lambda'

describe('deleteUserhHandler', () => {
  beforeEach(async () => {
    await supabaseClient().from('tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  test('削除処理が成功すること', async () => {
    const user = await prepareUser({})
    const token = await prepareUserToken(user)

    const result = await deleteUserHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParameters: {
          id: user.id,
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as AppApiContext,
    )
    const { statusCode } = parseHandlerJsonResponse<undefined>(result)

    expect(statusCode).toBe(200)
  })

  test('別ユーザーは削除できないこと', async () => {
    const user = await prepareUser({})
    const targetUser = await prepareUser({})
    const token = await prepareUserToken(user)

    const result = await deleteUserHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParameters: {
          id: targetUser.id,
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as AppApiContext,
    )
    const { statusCode } = parseHandlerJsonResponse<undefined>(result)

    expect(statusCode).toBe(403)
  })
})
