import { formatJSONResponse } from '@libs/api-gateway'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'
import { updateTaskSchema } from '@/domain/tasks/task'
import { updateTask } from '@/domain/tasks/api/update-task'

/**
 * 編集
 */
export const updateTaskAdminHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const taskId = event.pathParameters?.id
  const parseResult = updateTaskSchema.safeParse(event.body ?? '{}')
  if (taskId == null) {
    throw new createHttpError.BadRequest('idが指定されていません')
  }
  if (!parseResult.success) {
    console.error(parseResult.error.errors)
    throw new createHttpError.BadRequest()
  }

  const newData = parseResult.data

  await updateTask(taskId, newData)
  return formatJSONResponse({})
})
