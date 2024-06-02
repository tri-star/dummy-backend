import { supabaseClient } from '@libs/supabase/api-client'
import { ulid } from 'ulid'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { AdminAppDefinition } from '@/functions/admin-app'
import { AdminAuthLambdaHandlerDefinition } from '@/functions/admin/auth/lambda-handler'

describe('admin-auth-handler.test', () => {
  let adminApp: AdminAppDefinition
  let lambdaDefinition: AdminAuthLambdaHandlerDefinition

  beforeEach(async () => {
    adminApp = new AdminAppDefinition()
    lambdaDefinition = new AdminAuthLambdaHandlerDefinition()
    adminApp.addDefinition(lambdaDefinition)

    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
  })

  describe('adminLoginHandler', () => {
    test('トークン発行が成功すること', async () => {
      const adminUserId = ulid()
      const password = 'testtest'
      const user = await prepareAdminUser({ adminUserId, password })

      const result = await adminApp.openApiApp().request('admin/auth/login', {
        method: 'post',
        body: JSON.stringify({
          loginId: user.loginId,
          password,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      expect(result.status).toBe(200)
      expect(((await result.json()) as { token: string }).token).toHaveLength(30)
    })

    test('認証に失敗した場合401レスポンスが返ること', async () => {
      const adminUserId = ulid()
      const password = 'testtest'
      const wrongPassword = 'wrongPassword'
      const user = await prepareAdminUser({ adminUserId, password })

      const result = await adminApp.openApiApp().request('admin/auth/login', {
        method: 'post',
        body: JSON.stringify({
          loginId: user.loginId,
          password: wrongPassword,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      expect(await result.text()).toBe('ログインに失敗しました')
      expect(result.status).toBe(401)
    })
  })
})
