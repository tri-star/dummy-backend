import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { type CreateCompany } from '@/domain/company/company'
import { createAdminApp } from '@functions/admin-app'
import { AdminCompanyLambdaHandlerDefinition } from '@functions/admin/companies/lambda-handler'
import { ROUTES } from '@functions/route-consts'

describe('createCompanyAction', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
    await supabaseClient().from('companies').delete().neq('id', '')
  })

  test('登録処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)

    const adminApp = createAdminApp()
    const lambdaDefinition = new AdminCompanyLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(adminApp)

    const result = await adminApp.request(ROUTES.ADMIN.COMPANIES.CREATE.DEFINITION, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: '株式会社デモ',
        postalCode: '123-4567',
        prefecture: '東京都',
        address1: '渋谷区',
        address2: '1-2-3',
        address3: 'アパート',
        phone: '090-1234-5678',
        canUseFeatureA: true,
        canUseFeatureB: false,
        canUseFeatureC: true,
      } satisfies CreateCompany),
    })

    expect(result.status).toBe(200)
    expect(((await result.json()) as { name: string }).name).toBe('株式会社デモ')
  })
})
