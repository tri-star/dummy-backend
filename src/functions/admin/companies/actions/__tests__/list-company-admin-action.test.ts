import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { prepareCompanies } from '@libs/jest/company-utils'
import { createAdminApp } from '@functions/admin-app'
import { AdminCompanyLambdaHandlerDefinition } from '@functions/admin/companies/lambda-handler'
import { ROUTES } from '@functions/route-consts'

describe('listCompanyAdminAction', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
    await supabaseClient().from('companies').delete().neq('id', '')
  })

  test('一覧を取得できること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)

    await prepareCompanies({ name: '株式会社' }, 10)

    const adminApp = createAdminApp()
    const lambdaDefinition = new AdminCompanyLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(adminApp)

    const result = await adminApp.request(ROUTES.ADMIN.COMPANIES.LIST.DEFINITION, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(((await result.json()) as { count: number }).count).toBe(10)
    expect(result.status).toBe(200)
  })
})
