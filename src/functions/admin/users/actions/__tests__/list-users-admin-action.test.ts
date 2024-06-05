import { supabaseClient } from '@libs/supabase/api-client'
import { prepareUsers } from '@libs/jest/user-utils'
import { ROUTES } from '@functions/route-consts'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { createAdminApp } from '@functions/admin-app'
import { UserAdminLambdaHandlerDefinition } from '@functions/admin/users/handler'

describe('listUserAdminAction', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_users').delete().neq('id', '')
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  test('一覧を取得できること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)

    await prepareUsers({}, 10)

    const adminApp = createAdminApp()
    const lambdaDefinition = new UserAdminLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(adminApp)

    const result = await adminApp.request(ROUTES.ADMIN.USERS.LIST.DEFINITION, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(((await result.json()) as { count: number }).count).toBe(10)
    expect(result.status).toBe(200)
  })
})
