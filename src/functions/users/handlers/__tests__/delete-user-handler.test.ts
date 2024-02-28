import { supabase } from '@libs/supabase/api-client'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareUser } from '@libs/jest/user-utils'
import { prepareUserToken } from '@libs/jest/auth-utils'
import { deleteUserHandler } from '../delete-user-handler'

describe('deleteUserhHandler', () => {
  beforeEach(async () => {
    await supabase.from('tokens').delete().neq('id', '')
    await supabase.from('users').delete().neq('id', '')
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
      undefined as unknown as Context,
    )
    const { statusCode } = parseHandlerJsonResponse<undefined>(result)

    expect(statusCode).toBe(200)
  })
})
