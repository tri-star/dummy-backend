import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { prepareCompany } from '@libs/jest/company-utils'
import { createAdminApp } from '@functions/admin-app'
import { AdminCompanyLambdaHandlerDefinition } from '@functions/admin/companies/lambda-handler'
import { ROUTES } from '@functions/route-consts'

describe('FetcCompanyHandler', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
    await supabaseClient().from('companies').delete().neq('id', '')
  })

  test('会社を取得できること', async () => {
    const user = await prepareAdminUser({})
    const token = await prepareAdminUserToken(user)

    const company = await prepareCompany({})

    const adminApp = createAdminApp()
    const lambdaDefinition = new AdminCompanyLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(adminApp)

    const result = await adminApp.request(ROUTES.ADMIN.COMPANIES.DETAIL.URL(company.id), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(((await result.json()) as { id: number }).id).toBe(company.id)
    expect(result.status).toBe(200)
  })
})
