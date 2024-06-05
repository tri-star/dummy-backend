import { supabaseClient } from '@libs/supabase/api-client'
import { type CreateUser } from '@/domain/users/user'
import { ROUTES } from '@functions/route-consts'
import { createAdminApp } from '@functions/admin-app'
import { UserAdminLambdaHandlerDefinition } from '@functions/admin/users/handler'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'

describe('createUserAdminAction', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_users').delete().neq('id', '')
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('users').delete().neq('id', '')
  })

  test('登録処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)

    const adminApp = createAdminApp()
    const lambdaDefinition = new UserAdminLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(adminApp)

    const result = await adminApp.request(ROUTES.ADMIN.USERS.CREATE.DEFINITION, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'test',
        loginId: 'test',
        password: 'password',
        email: 'test@example.com',
      } satisfies CreateUser),
    })

    expect(((await result.json()) as { name: string }).name).toBe('test')
    expect(result.status).toBe(200)
  })
})
