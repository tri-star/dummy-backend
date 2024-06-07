import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { prepareTask } from '@libs/jest/task-utils'
import { prepareCompany } from '@libs/jest/company-utils'
import { createAdminApp } from '@functions/admin-app'
import { AdminTasksLambdaHandlerDefinition } from '@functions/admin/tasks/lambda-handler'
import { ROUTES } from '@functions/route-consts'
import { type UpdateTask } from '@/domain/tasks/task'

describe('updateTaskAdminAction', () => {
  beforeEach(async () => {
    await supabaseClient().from('admin_tokens').delete().neq('id', '')
    await supabaseClient().from('admin_users').delete().neq('id', '')
    await supabaseClient().from('tasks').delete().neq('id', '')
    await supabaseClient().from('companies').delete().neq('id', '')
  })

  test('更新処理が成功すること', async () => {
    const adminUser = await prepareAdminUser({})
    const token = await prepareAdminUserToken(adminUser)
    const company = await prepareCompany({})
    const targetTask = await prepareTask({
      companyId: company.id,
      title: 'target_task',
    })

    const adminApp = createAdminApp()
    const lambdaDefinition = new AdminTasksLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(adminApp)

    const result = await adminApp.request(ROUTES.ADMIN.TASKS.UPDATE.URL(targetTask.id), {
      method: 'put',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...targetTask,
        title: 'updated_task',
      } satisfies UpdateTask),
    })

    expect(result.status).toBe(204)
  })
})
