import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { createAdminApp } from '@functions/admin-app'
import { AdminAdminUserLambdaHandlerDefinition } from '@functions/admin/admin-user/lambda-handler'
import { ROUTES } from '@functions/route-consts'

describe('FetcAdminAdminUser', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
  })

  test('ユーザーを取得できること', async () => {
    const user = await prepareAdminUser({})
    const token = await prepareAdminUserToken(user)

    const adminApp = createAdminApp()
    const lambdaDefinition = new AdminAdminUserLambdaHandlerDefinition()
    adminApp.route('/', lambdaDefinition.buildOpenApiRoute(adminApp))

    const response = await adminApp.request(ROUTES.ADMIN.ADMIN_USERS.DETAIL.URL(user.id), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(((await response.json()) as { id: string }).id).toBe(user.id)
    expect(response.status).toBe(200)
  })
})
