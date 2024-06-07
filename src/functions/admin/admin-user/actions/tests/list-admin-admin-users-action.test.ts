import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser, prepareAdminUsers } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { createAdminApp } from '@functions/admin-app'
import { AdminAdminUserLambdaHandlerDefinition } from '@functions/admin/admin-user/lambda-handler'
import { ROUTES } from '@functions/route-consts'

describe('listAdminUsersHandler', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
  })

  test('一覧を取得できること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)

    await prepareAdminUsers({}, 10)

    const adminApp = createAdminApp()
    const lambdaDefinition = new AdminAdminUserLambdaHandlerDefinition()
    adminApp.route('/', lambdaDefinition.buildOpenApiRoute(adminApp))

    const result = await adminApp.request(ROUTES.ADMIN.ADMIN_USERS.LIST.DEFINITION, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(result.status).toBe(200)
    expect(((await result.json()) as { count: number })?.count).toBe(11)
  })
})
