import { supabase } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { createCompanyHandler } from '@/functions/admin/companies/handlers/create-company-handler'
import { type Company } from '@/domain/company/company'

describe('createCompanyHandler', () => {
  beforeEach(async () => {
    await supabase.from('admin_tokens').delete().neq('id', '')
    await supabase.from('admin_users').delete().neq('id', '')
  })

  test('登録処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)

    const result = await createCompanyHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {
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
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as Context,
    )
    const { statusCode, body } = parseHandlerJsonResponse<{ data: Company }>(result)

    expect(statusCode).toBe(200)
    expect(body?.data.name).toBe('株式会社デモ')
  })
})
