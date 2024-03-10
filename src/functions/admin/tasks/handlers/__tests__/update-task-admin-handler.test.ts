import { supabase } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { type APIGatewayProxyEvent, type Context } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareTask } from '@libs/jest/task-utils'
import { updateTaskAdminHandler } from '@/functions/admin/tasks/handlers/update-task-admin-handler'
import { prepareCompany } from '@libs/jest/company-utils'

describe('updateTaskHandler', () => {
  beforeEach(async () => {
    await supabase.from('admin_tokens').delete().neq('id', '')
    await supabase.from('admin_users').delete().neq('id', '')
    await supabase.from('tasks').delete().neq('id', '')
    await supabase.from('companies').delete().neq('id', '')
  })

  test('更新処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)
    const company = await prepareCompany({})
    const targetTask = await prepareTask({
      companyId: company.id,
      title: 'target_task',
    })

    const result = await updateTaskAdminHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParameters: {
          id: targetTask.id,
        },
        body: {
          ...targetTask,
          title: 'updated_task',
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as Context,
    )
    const { statusCode } = parseHandlerJsonResponse<undefined>(result)

    expect(statusCode).toBe(200)
  })
})
