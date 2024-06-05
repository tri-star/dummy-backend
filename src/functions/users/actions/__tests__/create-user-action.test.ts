import { supabaseClient } from '@libs/supabase/api-client'
import { prepareUser } from '@libs/jest/user-utils'
import { prepareUserToken } from '@libs/jest/auth-utils'
import { type CreateUser } from '@/domain/users/user'
import { UserLambdaHandlerDefinition } from '@functions/users/handler'
import { createApp } from '@functions/app'
import { ROUTES } from '@functions/route-consts'

describe('createUserAction', () => {
  beforeEach(async () => {
    await supabaseClient().from('tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  test('登録処理が成功すること', async () => {
    const adminUser = await prepareUser({})
    const token = await prepareUserToken(adminUser)

    const app = createApp()
    const lambdaDefinition = new UserLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(app)

    const result = await app.request(ROUTES.USERS.CREATE.DEFINITION, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'test',
        loginId: 'test',
        password: 'password',
        email: 'test@example.com',
      } satisfies CreateUser),
    })

    expect(((await result.json()) as { name: string }).name).toBe('test')
    expect(result.status).toBe(200)
  })
})
