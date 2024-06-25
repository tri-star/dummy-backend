import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { type AdminAppContext, createAdminApp } from '@functions/admin-app'
import { ROUTES } from '@functions/route-consts'
import { AdminAuthLambdaHandlerDefinition } from '@functions/admin/auth/lambda-handler'
import { type OpenAPIHono } from '@hono/zod-openapi'

describe('ValidateLoginIdAction', () => {
  let adminApp: OpenAPIHono<AdminAppContext>
  let lambdaDefinition: AdminAuthLambdaHandlerDefinition

  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
    adminApp = createAdminApp()
    lambdaDefinition = new AdminAuthLambdaHandlerDefinition()
    adminApp.route('/', lambdaDefinition.buildOpenApiRoute(adminApp))
  })

  test('未使用のIDは利用可と判定されること', async () => {
    const user = await prepareAdminUser({})
    const token = await prepareAdminUserToken(user)

    const testLoginId = 'test-login-id'
    const query = `?loginId=${testLoginId}`
    const response = await adminApp.request(ROUTES.ADMIN.AUTH.VALIDATE_LOGIN_ID.DEFINITION + query, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(((await response.json()) as { valid: boolean }).valid).toBe(true)
    expect(response.status).toBe(200)
  })

  test('使用済のIDは利用不可と判定されること', async () => {
    const user = await prepareAdminUser({})
    const token = await prepareAdminUserToken(user)
    const existingUser = await prepareAdminUser({})

    const query = `?loginId=${existingUser.loginId}`
    const response = await adminApp.request(ROUTES.ADMIN.AUTH.VALIDATE_LOGIN_ID.DEFINITION + query, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(((await response.json()) as { valid: boolean }).valid).toBe(false)
    expect(response.status).toBe(200)
  })

  test('自分のIDは利用可と判定されること', async () => {
    const user = await prepareAdminUser({})
    const token = await prepareAdminUserToken(user)

    const query = `?loginId=${user.loginId}&except=${user.id}`
    const response = await adminApp.request(ROUTES.ADMIN.AUTH.VALIDATE_LOGIN_ID.DEFINITION + query, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(((await response.json()) as { valid: boolean }).valid).toBe(true)
    expect(response.status).toBe(200)
  })
})
