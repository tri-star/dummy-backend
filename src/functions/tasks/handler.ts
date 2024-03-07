import { deleteTask, fetchTasks, updateTask } from '@/domain/tasks/api/task-api'
import { updateTaskSchema } from '@/domain/tasks/task'
import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'

/**
 * 一覧
 */
export const listTasksHandler = middyfy(async () => {
  try {
    const tasks = await fetchTasks()
    return formatJSONResponse({
      data: tasks.data,
      count: tasks.count,
    })
  } catch (e) {
    return formatJSONUserErrorResponse({ error: e })
  }
})

export const updateTaskHandler = middyfy(async (event: APIGatewayProxyEvent) => {
  const taskId = event.pathParameters?.id
  if (taskId == null) {
    return formatJSONUserErrorResponse({ error: new Error('taskId is required') })
  }

  const parseResult = updateTaskSchema.safeParse(event.body)
  if (!parseResult.success) {
    console.error('updateTaskHandler error', parseResult.error.errors)
    formatJSONUserErrorResponse({ errors: parseResult.error.errors })
    return
  }

  const task = parseResult.data

  await updateTask(taskId, {
    title: task.title,
    companyId: task.companyId,
    description: task.description,
    status: task.status,
    reasonCode: task.reasonCode,
  })

  return formatJSONResponse({})
})

export const deleteTaskHandler = middyfy(async (event: APIGatewayProxyEvent) => {
  const taskId = event.pathParameters?.id
  if (taskId == null) {
    return formatJSONUserErrorResponse({ error: new Error('taskId is required') })
  }

  await deleteTask(taskId)

  return formatJSONResponse({})
})
