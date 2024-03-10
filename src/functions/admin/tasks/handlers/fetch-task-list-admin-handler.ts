import { fetchTaskList } from '@/domain/tasks/api/fetch-task-list'
import { taskSchema } from '@/domain/tasks/task'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'
import z from 'zod'

const listTasksRequestSchema = z.object({
  keyword: z.string().optional(),
  page: z.number().optional(),
  offset: z.number().optional(),
})

const listTasksResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(taskSchema),
  count: z.number(),
})
export type FetchTasksListResponse = z.infer<typeof listTasksResponseSchema>

/**
 * 一覧
 */
export const fetchTasksListAdminHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const parsed = listTasksRequestSchema.safeParse(JSON.parse(event.body ?? '{}'))
  if (!parsed.success) {
    throw new createHttpError.BadRequest()
  }
  const { keyword /* page, offset */ } = parsed.data

  const taskListResponse = await fetchTaskList(keyword)
  return formatJSONResponse({
    success: true,
    data: taskListResponse?.data ?? [],
    count: taskListResponse?.count ?? 0,
  } satisfies FetchTasksListResponse)
})
