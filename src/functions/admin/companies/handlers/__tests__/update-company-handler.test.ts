import { supabase } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareCompany } from '@libs/jest/company-utils'
import { updateCompanyHandler } from '@/functions/admin/companies/handlers/update-company-handler'

describe('updateCompanyHandler', () => {
  beforeEach(async () => {
    await supabase.from('admin_tokens').delete().neq('id', '')
    await supabase.from('admin_users').delete().neq('id', '')
    await supabase.from('companies').delete().neq('id', '')
  })

  test('更新処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)
    const targetCompany = await prepareCompany({
      name: 'target_company',
    })

    const result = await updateCompanyHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParameters: {
          id: targetCompany.id,
        },
        body: {
          ...targetCompany,
          name: 'updated_company',
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as Context,
    )
    const { statusCode } = parseHandlerJsonResponse<undefined>(result)

    expect(statusCode).toBe(200)
  })
})
