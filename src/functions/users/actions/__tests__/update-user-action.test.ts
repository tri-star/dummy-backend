import { supabaseClient } from '@libs/supabase/api-client'
import { prepareUser } from '@libs/jest/user-utils'
import { prepareUserToken } from '@libs/jest/auth-utils'
import { type UpdateUser } from '@/domain/users/user'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { createApp, type AppContext } from '@functions/app'
import { UserLambdaHandlerDefinition } from '@functions/users/handler'
import { ROUTES } from '@functions/route-consts'

describe('updateUserAction', () => {
  let app: OpenAPIHono<AppContext>
  let lambdaDefinition: UserLambdaHandlerDefinition

  beforeEach(async () => {
    app = createApp()
    lambdaDefinition = new UserLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(app)

    await supabaseClient().from('tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  test('更新処理が成功すること', async () => {
    const user = await prepareUser({})
    const token = await prepareUserToken(user)

    const result = await app.request(ROUTES.USERS.UPDATE.URL(user.id), {
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'test',
        loginId: 'updated_login_id',
        email: 'test@example.com',
      } satisfies UpdateUser),
    })

    expect(result.status).toBe(204)
  })

  test('自分以外のユーザーを更新できないこと', async () => {
    const user = await prepareUser({})
    const targetUser = await prepareUser({})
    const token = await prepareUserToken(user)

    const result = await app.request(ROUTES.USERS.UPDATE.URL(targetUser.id), {
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'test',
        loginId: 'updated_login_id',
        email: 'test2@example.com',
      } satisfies UpdateUser),
    })

    expect(result.status).toBe(403)
  })
})
