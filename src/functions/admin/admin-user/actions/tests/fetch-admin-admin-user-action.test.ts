import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { AdminAppDefinition } from '@functions/admin-app'
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

    const adminApp = new AdminAppDefinition()
    adminApp.addDefinition(new AdminAdminUserLambdaHandlerDefinition())

    const response = await adminApp.openApiApp().request(ROUTES.ADMIN.ADMIN_USERS.DETAIL.URL(user.id), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(((await response.json()) as { id: string }).id).toBe(user.id)
    expect(response.status).toBe(200)
  })
})
