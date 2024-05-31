import { dbTaskSchema, type Task } from '@/domain/tasks/task'
import { supabaseClient } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'
import dayjs from 'dayjs'
import { type PostgrestFilterBuilder } from '@supabase/postgrest-js'

export type TaskListResponse = {
  data: Task[]
  count: number
}

function buildSearchQuery(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseQuery: PostgrestFilterBuilder<any, any, unknown[], 'tasks', unknown>,
  keyword?: string,
) {
  if (keyword != null) {
    baseQuery = baseQuery.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%`)
  }
  return baseQuery
}

/**
 * タスク一覧を取得する
 */
export async function fetchTaskList(name?: string): Promise<TaskListResponse> {
  const segment = createSegment('Supabase')

  const result = await traceAsync<TaskListResponse>(segment, 'query', async () => {
    const dbTaskListQuery = buildSearchQuery(supabaseClient().from('tasks').select('*'), name)
    const dbTaskCountQuery = buildSearchQuery(
      supabaseClient().from('tasks').select('*', { count: 'exact', head: true }),
      name,
    )

    const dbTaskList = await dbTaskListQuery
    const countRecord = await dbTaskCountQuery
    const count = countRecord.count ?? 0
    if (dbTaskList.error != null) {
      throw new Error(JSON.stringify(dbTaskList.error))
    }

    const tasks: Task[] =
      dbTaskList.data
        ?.map((dbTaskJson) => {
          const parseResult = dbTaskSchema.safeParse(dbTaskJson)
          if (!parseResult.success) {
            console.error(parseResult.error.errors)
            return undefined
          }
          return {
            id: parseResult.data.id,
            title: parseResult.data.title,
            description: parseResult.data.description,
            companyId: parseResult.data.company_id,
            createdUserId: parseResult.data.created_user,
            reasonCode: parseResult.data.reason_code ?? undefined,
            status: parseResult.data.status,
            createdAt: dayjs(parseResult.data.created_at).toDate(),
            updatedAt: dayjs(parseResult.data.updated_at).toDate(),
          } satisfies Task as Task
        })
        .filter((task): task is Task => task !== undefined) ?? []

    return {
      data: tasks,
      count,
    }
  })

  return result
}
