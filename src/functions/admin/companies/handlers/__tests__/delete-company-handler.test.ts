import { supabase } from '@libs/supabase/api-client'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { type AppApiContext } from '@libs/lambda'
import { deleteAdminUserHandler } from '@/functions/admin/users/handlers/delete-admin-user-handler'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareCompany } from '@libs/jest/company-utils'

describe('deleteCompanyHandler', () => {
  beforeEach(async () => {
    await supabase.from('admin_tokens').delete().neq('id', '')
    await supabase.from('admin_users').delete().neq('id', '')
    await supabase.from('companies').delete().neq('id', '')
  })

  test('削除処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)
    const company = await prepareCompany({})

    const result = await deleteAdminUserHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParameters: {
          id: company.id,
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as AppApiContext,
    )
    const { statusCode } = parseHandlerJsonResponse<undefined>(result)

    expect(statusCode).toBe(200)
  })
})
