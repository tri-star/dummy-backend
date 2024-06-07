import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareTask } from '@libs/jest/task-utils'
import { prepareCompany } from '@libs/jest/company-utils'
import { createAdminApp } from '@functions/admin-app'
import { AdminTasksLambdaHandlerDefinition } from '@functions/admin/tasks/lambda-handler'
import { ROUTES } from '@functions/route-consts'

describe('taskDeleteAdminHandler', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
    await supabaseClient().from('tasks').delete().neq('id', '')
    await supabaseClient().from('companies').delete().neq('id', '')
  })

  test('削除できること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)
    const company = await prepareCompany({})
    const task = await prepareTask({ companyId: company.id })

    const adminApp = createAdminApp()
    const lambdaDefinition = new AdminTasksLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(adminApp)

    const result = await adminApp.request(ROUTES.ADMIN.TASKS.DELETE.URL(task.id), {
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(result.status).toBe(204)
  })
})
