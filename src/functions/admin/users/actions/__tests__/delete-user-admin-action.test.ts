import { supabaseClient } from '@libs/supabase/api-client'
import { prepareUser } from '@libs/jest/user-utils'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { ROUTES } from '@functions/route-consts'
import { createAdminApp } from '@functions/admin-app'
import { UserAdminLambdaHandlerDefinition } from '@functions/admin/users/handler'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'

describe('deleteUseAdminAction', () => {
  let app: OpenAPIHono
  let lambdaDefinition: UserAdminLambdaHandlerDefinition

  beforeEach(async () => {
    app = createAdminApp()
    lambdaDefinition = new UserAdminLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(app)

    await supabaseClient().from('admin_users').delete().neq('id', '')
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  test('削除処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)
    const targetUser = await prepareUser({})

    const result = await app.request(ROUTES.ADMIN.USERS.DELETE.URL(targetUser.id), {
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    expect(result.status).toBe(204)
  })
})
