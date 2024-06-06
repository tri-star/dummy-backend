import { supabaseClient } from '@libs/supabase/api-client'
import { prepareUser } from '@libs/jest/user-utils'
import { type UpdateUser } from '@/domain/users/user'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { ROUTES } from '@functions/route-consts'
import { createAdminApp } from '@functions/admin-app'
import { UserAdminLambdaHandlerDefinition } from '@functions/admin/users/handler'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'

describe('updateUserAdminAction', () => {
  let adminApp: OpenAPIHono
  let lambdaDefinition: UserAdminLambdaHandlerDefinition

  beforeEach(async () => {
    adminApp = createAdminApp()
    lambdaDefinition = new UserAdminLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(adminApp)

    await supabaseClient().from('admin_users').delete().neq('id', '')
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  test('更新処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)
    const targetUser = await prepareUser({})

    const result = await adminApp.request(ROUTES.ADMIN.USERS.UPDATE.URL(targetUser.id), {
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
})
