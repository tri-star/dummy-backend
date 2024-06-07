import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { createAdminApp } from '@functions/admin-app'
import { AdminAdminUserLambdaHandlerDefinition } from '@functions/admin/admin-user/lambda-handler'
import { ROUTES } from '@functions/route-consts'

describe('deleteAdminAdminUserAction', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
  })

  test('削除処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)
    const targetUser = await prepareAdminUser({})

    const adminApp = createAdminApp()
    const lambdaDefinition = new AdminAdminUserLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(adminApp)

    const result = await adminApp.request(ROUTES.ADMIN.ADMIN_USERS.DELETE.URL(targetUser.id), {
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    expect(result.status).toBe(204)
  })
})
