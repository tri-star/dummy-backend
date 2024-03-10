import { supabase } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { prepareCompany } from '@libs/jest/company-utils'
import {
  type FetchTasksListResponse,
  fetchTaskListAdminHandler,
} from '@/functions/admin/tasks/handlers/fetch-task-list-admin-handler'
import { prepareTasks } from '@libs/jest/task-utils'

describe('fetchTaskListHandler', () => {
  beforeEach(async () => {
    await supabase.from('admin_tokens').delete().neq('id', '')
    await supabase.from('admin_users').delete().neq('id', '')
    await supabase.from('tasks').delete().neq('id', '')
    await supabase.from('companies').delete().neq('id', '')
  })

  test('一覧を取得できること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)
    const company = await prepareCompany({})

    await prepareTasks(company.id, {}, 10)

    const result = await fetchTaskListAdminHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as Context,
    )

    const { statusCode, body } = parseHandlerJsonResponse<FetchTasksListResponse>(result)

    expect(statusCode).toBe(200)
    expect(body?.count).toBe(10)
  })
})
