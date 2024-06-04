import { supabaseClient } from '@libs/supabase/api-client'
import { prepareAdminUser } from '@libs/jest/admin-user-utils'
import { prepareAdminUserToken } from '@libs/jest/admin-auth-utils'
import { prepareUser } from '@libs/jest/user-utils'
import { prepareCompany } from '@libs/jest/company-utils'
import { type CreateTaskAdmin, TASK_STATUS_CODES } from '@/domain/tasks/task'
import { createAdminApp } from '@functions/admin-app'
import { AdminTasksLambdaHandlerDefinition } from '@functions/admin/tasks/lambda-handler'
import { ROUTES } from '@functions/route-consts'

describe('createTaskAdminAction', () => {
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

    const adminApp = createAdminApp()
    const lambdaDefinition = new AdminTasksLambdaHandlerDefinition()
    lambdaDefinition.buildOpenApiRoute(adminApp)

    const result = await adminApp.request(ROUTES.ADMIN.TASKS.CREATE.DEFINITION, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyId: company.id,
        createdUserId: user.id,
        title: 'タスクタイトル',
        description: 'タスクの説明',
        status: TASK_STATUS_CODES.TODO,
      } satisfies CreateTaskAdmin),
    })

    expect(result.status).toBe(200)
    expect(((await result.json()) as { title: string }).title).toBe('タスクタイトル')
  })
})
