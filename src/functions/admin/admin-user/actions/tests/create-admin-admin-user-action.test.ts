import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { CreateAdminAdminUserAction } from '@/functions/admin/admin-user/actions/create-admin-admin-user-action'
import { ROUTES } from '@/functions/route-consts'
import { type CreateAdminUser } from '@/domain/admin-users/admin-user'

describe('createAdminAdminUserAction', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
  })

  test('登録処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)

    const definition = new CreateAdminAdminUserAction()
    const action = definition.actionDefinition()

    const userData: CreateAdminUser = {
      name: 'test',
      loginId: 'test-login-id',
      password: 'password',
    }

    const result = await action.request(ROUTES.ADMIN.ADMIN_USERS.CREATE.DEFINITION, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    expect(await result.json()).toMatchObject({
      name: userData.name,
      loginId: userData.loginId,
    })
    expect(result.status).toBe(200)
  })
})
