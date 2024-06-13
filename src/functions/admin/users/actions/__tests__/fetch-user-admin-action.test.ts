import { prepareUser } from '@libs/jest/user-utils'
import { supabaseClient } from '@libs/supabase/api-client'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { ROUTES } from '@functions/route-consts'
import { UserAdminLambdaHandlerDefinition } from '@functions/admin/users/handler'
import { type AdminAppContext, createAdminApp } from '@functions/admin-app'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'

describe('FetchUserAdminAction', () => {
  let app: OpenAPIHono<AdminAppContext>
  let lambdaDefinition: UserAdminLambdaHandlerDefinition

  beforeEach(async () => {
    app = createAdminApp()
    lambdaDefinition = new UserAdminLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(app)

    await supabaseClient().from('admin_users').delete().neq('id', '')
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  test('ユーザーを取得できること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)
    const user = await prepareUser({})

    const result = await app.request(ROUTES.ADMIN.USERS.DETAIL.URL(user.id), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(result.status).toBe(200)
    expect(((await result.json()) as { id: string }).id).toBe(user.id)
  })
})
