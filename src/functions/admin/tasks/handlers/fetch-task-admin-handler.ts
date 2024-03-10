import { fetchTask } from '@/domain/tasks/api/fetch-task'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'

/**
 * タスク取得
 */
export const fetchTaskAdminHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const taskId = event.pathParameters?.id
  if (taskId == null) {
    throw new createHttpError.BadRequest()
  }

  const taskResponse = await fetchTask(taskId)
  return formatJSONResponse({
    success: true,
    data: taskResponse,
  })
})
