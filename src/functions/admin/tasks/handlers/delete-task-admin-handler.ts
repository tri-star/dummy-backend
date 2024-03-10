import { type APIGatewayProxyEvent } from 'aws-lambda'
import { deleteTask } from '@/domain/tasks/api/delete-task'
import createHttpError from 'http-errors'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfyWithAdminAuth } from '@libs/lambda'

export const deleteTaskAdminHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const taskId = event.pathParameters?.id
  if (!taskId) {
    throw new createHttpError.BadRequest()
  }

  await deleteTask(taskId)
  return formatJSONResponse({})
})
