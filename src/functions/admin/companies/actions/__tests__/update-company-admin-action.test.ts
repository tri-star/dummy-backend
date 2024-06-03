import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { prepareCompany } from '@libs/jest/company-utils'
import { createAdminApp } from '@functions/admin-app'
import { AdminCompanyLambdaHandlerDefinition } from '@functions/admin/companies/lambda-handler'
import { ROUTES } from '@functions/route-consts'
import { type UpdateCompany } from '@/domain/company/company'

describe('updateCompanyAction', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
    await supabaseClient().from('companies').delete().neq('id', '')
  })

  test('更新処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)
    const targetCompany = await prepareCompany({
      name: 'target_company',
    })

    const adminApp = createAdminApp()
    const lambdaDefinition = new AdminCompanyLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(adminApp)

    const result = await adminApp.request(ROUTES.ADMIN.COMPANIES.UPDATE.URL(targetCompany.id), {
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...targetCompany,
        name: 'updated_company',
      } satisfies UpdateCompany),
    })

    expect(result.status).toBe(204)
  })
})
