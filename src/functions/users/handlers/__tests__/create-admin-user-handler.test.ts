import { supabase } from '@libs/supabase/api-client'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareUser } from '@libs/jest/user-utils'
import { prepareUserToken } from '@libs/jest/auth-utils'
import { createUserHandler } from '../create-user-handler'
import { type User } from '@/domain/users/user'
import { type AppApiContext } from '@libs/lambda'

describe('createUserhHandler', () => {
  beforeEach(async () => {
    await supabase.from('tokens').delete().neq('id', '')
    await supabase.from('users').delete().neq('id', '')
  })

  test('登録処理が成功すること', async () => {
    const adminUser = await prepareUser({})
    const token = await prepareUserToken(adminUser)

    const result = await createUserHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
          name: 'test',
          loginId: 'test',
          password: 'password',
          email: 'test@example.com',
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as AppApiContext,
    )
    const { statusCode, body } = parseHandlerJsonResponse<{ data: User }>(result)

    expect(statusCode).toBe(200)
    expect(body?.data.name).toBe('test')
  })
})
