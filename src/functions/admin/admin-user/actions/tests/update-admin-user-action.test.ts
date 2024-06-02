import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { createAdminApp } from '@functions/admin-app'
import { AdminAdminUserLambdaHandlerDefinition } from '@functions/admin/admin-user/lambda-handler'
import { ROUTES } from '@functions/route-consts'

describe('updateAdminAdminUserhAction', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
  })

  test('更新処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)
    const targetUser = await prepareAdminUser({
      loginId: 'target_user',
    })

    const adminApp = createAdminApp()
    const lambdaDefinition = new AdminAdminUserLambdaHandlerDefinition()
    adminApp.route('/', lambdaDefinition.buildOpenApiRoute(adminApp))

    const result = await adminApp.request(ROUTES.ADMIN.ADMIN_USERS.UPDATE.URL(targetUser.id), {
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'test',
        loginId: 'updated_login_id',
      }),
    })
    expect(result.status).toBe(204)
  })
})
