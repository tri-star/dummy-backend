import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { createTaskAdminHandler } from '@/functions/admin/tasks/handlers/create-task-admin-handler'
import { prepareUser } from '@libs/jest/user-utils'
import { prepareCompany } from '@libs/jest/company-utils'
import { type CreateTaskAdmin, TASK_STATUS_CODES, type Task } from '@/domain/tasks/task'

describe('createTaskAdminHandler', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
    await supabaseClient().from('tasks').delete().neq('id', '')
    await supabaseClient().from('companies').delete().neq('id', '')
  })

  test('登録処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const company = await prepareCompany({})
    const user = await prepareUser({})
    const token = await prepareAdminUserToken(adminUser)

    const result = await createTaskAdminHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParameters: {
          userId: user.id,
        },
        body: {
          companyId: company.id,
          createdUserId: user.id,
          title: 'タスクタイトル',
          description: 'タスクの説明',
          status: TASK_STATUS_CODES.TODO,
        } satisfies CreateTaskAdmin,
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as Context,
    )
    const { statusCode, body } = parseHandlerJsonResponse<{ data: Task }>(result)

    expect(statusCode).toBe(200)
    expect(body?.data.title).toBe('タスクタイトル')
  })
})
