import { supabaseClient } from '@libs/supabase/api-client'
import { prepareUser, prepareUsers } from '@libs/jest/user-utils'
import { prepareUserToken } from '@libs/jest/auth-utils'
import { createApp } from '@functions/app'
import { UserLambdaHandlerDefinition } from '@functions/users/handler'
import { ROUTES } from '@functions/route-consts'

describe('listUserAction', () => {
  beforeEach(async () => {
    await supabaseClient().from('tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  test('一覧を取得できること', async () => {
    const user = await prepareUser({})
    const token = await prepareUserToken(user)

    await prepareUsers({}, 10)

    const app = createApp()
    const lambdaDefinition = new UserLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(app)

    const result = await app.request(ROUTES.USERS.LIST.DEFINITION, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(((await result.json()) as { count: number }).count).toBe(11)
    expect(result.status).toBe(200)
  })
})
