import { supabaseClient } from '@libs/supabase/api-client'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { fetchTaskAdminHandler } from '@/functions/admin/tasks/handlers/fetch-task-admin-handler'
import { prepareTask } from '@libs/jest/task-utils'
import { type Task } from '@/domain/tasks/task'
import { prepareCompany } from '@libs/jest/company-utils'

describe('FetchTaskHandler', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
    await supabaseClient().from('tasks').delete().neq('id', '')
  })

  test('タスクを取得できること', async () => {
    const user = await prepareAdminUser({})
    const token = await prepareAdminUserToken(user)
    const company = await prepareCompany({})

    const task = await prepareTask({
      companyId: company.id,
    })

    const response = await fetchTaskAdminHandler(
      {
        pathParameters: { id: task.id },
        headers: { Authorization: `Bearer ${token}` },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      {} as Context,
    )

    const { statusCode, body } = parseHandlerJsonResponse<{ success: boolean; data: Task }>(response)
    expect(statusCode).toBe(200)
    expect(body?.data.id).toBe(task.id)
    expect(body?.success).toBe(true)
  })
})
