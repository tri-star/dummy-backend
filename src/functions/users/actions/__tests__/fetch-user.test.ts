import { prepareUserToken } from '@libs/jest/auth-utils'
import { prepareUser } from '@libs/jest/user-utils'
import { supabaseClient } from '@libs/supabase/api-client'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { createApp, type AppContext } from '@functions/app'
import { UserLambdaHandlerDefinition } from '@functions/users/handler'
import { ROUTES } from '@functions/route-consts'

describe('FetchUserAction', () => {
  let app: OpenAPIHono<AppContext>
  let lambdaDefinition: UserLambdaHandlerDefinition

  beforeEach(async () => {
    app = createApp()
    lambdaDefinition = new UserLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(app)

    await supabaseClient().from('tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  test('ユーザーを取得できること', async () => {
    const user = await prepareUser({})
    const token = await prepareUserToken(user)

    const result = await app.request(ROUTES.USERS.DETAIL.URL(user.id), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(result.status).toBe(200)
    expect(((await result.json()) as { id: string }).id).toBe(user.id)
  })

  test('自分以外のユーザーは取得できないこと', async () => {
    const user = await prepareUser({})
    const token = await prepareUserToken(user)
    const targetUser = await prepareUser({})

    const result = await app.request(ROUTES.USERS.DETAIL.URL(targetUser.id), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(result.status).toBe(403)
  })
})
