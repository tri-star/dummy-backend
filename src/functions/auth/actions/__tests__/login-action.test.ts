import { supabaseClient } from '@libs/supabase/api-client'
import { ulid } from 'ulid'
import { prepareUser } from '@libs/jest/user-utils'
import { type AppContext, createApp } from '@functions/app'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { AuthLambdaHandlerDefinition } from '@functions/auth/handler'
import { ROUTES } from '@functions/route-consts'

describe('loginAction', () => {
  let app: OpenAPIHono<AppContext>
  let lambdaDefinition: AuthLambdaHandlerDefinition
  beforeEach(async () => {
    app = createApp()
    lambdaDefinition = new AuthLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(app)

    await supabaseClient().from('tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  describe('LoginHandler', () => {
    test('トークン発行が成功すること', async () => {
      const userId = ulid()
      const password = 'testtest'
      const user = await prepareUser({ userId, password })

      const result = await app.request(ROUTES.AUTH.LOGIN.DEFINITION, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: user.loginId,
          password,
        }),
      })

      expect(((await result.json()) as { token: string }).token).toHaveLength(30)
      expect(result.status).toBe(200)
    })

    test('認証に失敗した場合401レスポンスが返ること', async () => {
      const userId = ulid()
      const password = 'testtest'
      const wrongPassword = 'wrongPassword'
      const user = await prepareUser({ userId, password })

      const result = await app.request(ROUTES.AUTH.LOGIN.DEFINITION, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: user.loginId,
          password: wrongPassword,
        }),
      })

      expect(result.status).toBe(401)
    })
  })
})
