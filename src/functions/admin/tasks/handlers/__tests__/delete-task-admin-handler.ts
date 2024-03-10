import { supabase } from '@libs/supabase/api-client'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareTask } from '@libs/jest/task-utils'
import { taskDeleteAdminHandler } from '@/functions/admin/tasks/handlers/delete-task-admin-handler'
import { prepareCompany } from '@libs/jest/company-utils'
import { type AdminApiContext } from '@libs/lambda'

describe('taskDeleteAdminHandler', () => {
  beforeEach(async () => {
    await supabase.from('admin_tokens').delete().neq('id', '')
    await supabase.from('admin_users').delete().neq('id', '')
    await supabase.from('tasks').delete().neq('id', '')
    await supabase.from('companies').delete().neq('id', '')
  })

  test('削除できること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)
    const company = await prepareCompany({})
    const task = await prepareTask({ companyId: company.id })

    const result = await taskDeleteAdminHandler(
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        pathParameters: {
          taskId: task.id,
        },
      } as unknown as APIGatewayProxyEvent & VersionedApiGatewayEvent,
      undefined as unknown as AdminApiContext,
    )
    const { statusCode } = parseHandlerJsonResponse<undefined>(result)

    expect(statusCode).toBe(200)
  })
})
