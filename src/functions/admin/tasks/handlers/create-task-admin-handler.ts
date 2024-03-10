import { formatJSONResponse } from '@libs/api-gateway'
import { ulid } from 'ulid'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'
import { createTaskAdminSchema } from '@/domain/tasks/task'
import { createTask } from '@/domain/tasks/api/create-task'
import { fetchUser } from '@/domain/users/api/fetch-user'
import { fetchCompany } from '@/domain/company/api/fetch-company'

/**
 * 登録
 */
export const createTaskAdminHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const parseResult = createTaskAdminSchema.safeParse(event.body ?? '{}')
  if (!parseResult.success) {
    throw new createHttpError.BadRequest()
  }

  const task = parseResult.data

  const company = await fetchCompany(task.companyId)
  if (company == null) {
    throw new createHttpError.BadRequest('会社が見つかりません')
  }
  const user = await fetchUser(task.createdUserId)
  if (user == null) {
    throw new createHttpError.BadRequest()
  }

  const taskId = ulid()
  const createdTask = await createTask(taskId, task)
  return formatJSONResponse({ data: createdTask })
})
