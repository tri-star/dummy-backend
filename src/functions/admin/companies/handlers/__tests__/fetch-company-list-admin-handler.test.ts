import { supabase } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { prepareCompanies } from '@libs/jest/company-utils'
import {
  type FetchCompanyListResponse,
  fetchCompanyListAdminHandler,
} from '@/functions/admin/companies/handlers/fetch-company-list-admin-handler'

describe('fetchCompanyListHandler', () => {
  beforeEach(async () => {
    await supabase.from('admin_tokens').delete().neq('id', '')
    await supabase.from('admin_users').delete().neq('id', '')
    await supabase.from('companies').delete().neq('id', '')
  })

  test('一覧を取得できること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)

    await prepareCompanies({ name: '株式会社' }, 10)

    const result = await fetchCompanyListAdminHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as Context,
    )

    const { statusCode, body } = parseHandlerJsonResponse<FetchCompanyListResponse>(result)

    expect(statusCode).toBe(200)
    expect(body?.count).toBe(10)
  })
})
