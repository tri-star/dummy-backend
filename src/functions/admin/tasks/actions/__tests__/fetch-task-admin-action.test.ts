import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { prepareTask } from '@libs/jest/task-utils'
import { prepareCompany } from '@libs/jest/company-utils'
import { createAdminApp } from '@functions/admin-app'
import { AdminTasksLambdaHandlerDefinition } from '@functions/admin/tasks/lambda-handler'
import { ROUTES } from '@functions/route-consts'

describe('FetchTaskAdminAction', () => {
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

    const adminApp = createAdminApp()
    const lambdaDefinition = new AdminTasksLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(adminApp)

    const result = await adminApp.request(ROUTES.ADMIN.TASKS.DETAIL.URL(task.id), {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    expect(((await result.json()) as { id: string }).id).toBe(task.id)
    expect(result.status).toBe(200)
  })
})
