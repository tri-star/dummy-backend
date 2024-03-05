import { supabase } from '@libs/supabase/api-client'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { fetchCompanyAdminHandler } from '@/functions/admin/companies/handlers/fetch-company-handler'
import { prepareCompany } from '@libs/jest/company-utils'
import { type Company } from '@/domain/company/company'

describe('FetcCompanyHandler', () => {
  beforeEach(async () => {
    await supabase.from('admin_tokens').delete().neq('id', '')
    await supabase.from('admin_users').delete().neq('id', '')
    await supabase.from('companies').delete().neq('id', '')
  })

  test('会社を取得できること', async () => {
    const user = await prepareAdminUser({})
    const token = await prepareAdminUserToken(user)

    const company = await prepareCompany({})

    const response = await fetchCompanyAdminHandler(
      {
        pathParameters: { id: company.id },
        headers: { Authorization: `Bearer ${token}` },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      {} as Context,
    )

    const { statusCode, body } = parseHandlerJsonResponse<{ success: boolean; data: Company }>(response)
    expect(statusCode).toBe(200)
    expect(body?.data.id).toBe(company.id)
    expect(body?.success).toBe(true)
  })
})
