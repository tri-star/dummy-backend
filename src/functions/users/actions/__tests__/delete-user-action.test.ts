import { supabaseClient } from '@libs/supabase/api-client'
import { prepareUser } from '@libs/jest/user-utils'
import { prepareUserToken } from '@libs/jest/auth-utils'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { type AppContext, createApp } from '@functions/app'
import { UserLambdaHandlerDefinition } from '@functions/users/handler'
import { ROUTES } from '@functions/route-consts'

describe('deleteUserAction', () => {
  let app: OpenAPIHono<AppContext>
  let lambdaDefinition: UserLambdaHandlerDefinition

  beforeEach(async () => {
    app = createApp()
    lambdaDefinition = new UserLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(app)

    await supabaseClient().from('tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  test('削除処理が成功すること', async () => {
    const user = await prepareUser({})
    const token = await prepareUserToken(user)

    const result = await app.request(ROUTES.USERS.DELETE.URL(user.id), {
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    expect(result.status).toBe(204)
  })

  test('別ユーザーは削除できないこと', async () => {
    const user = await prepareUser({})
    const targetUser = await prepareUser({})
    const token = await prepareUserToken(user)

    const result = await app.request(ROUTES.USERS.DELETE.URL(targetUser.id), {
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    expect(result.status).toBe(403)
  })
})
