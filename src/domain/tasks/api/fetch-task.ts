// fetch-task.ts
import { createSegment, traceAsync } from '@libs/xray-tracer'
import { supabaseClient } from '@libs/supabase/api-client'
import { dbTaskSchema, type Task } from '@/domain/tasks/task'

/**
 * タスクを取得する
 */
export async function fetchTask(taskId: string): Promise<Task | undefined> {
  const segment = createSegment('Supabase')

  const result = await traceAsync<Task | undefined>(segment, 'query', async () => {
    const dbResult = await supabaseClient().from('tasks').select('*').eq('id', taskId)

    if (dbResult.error != null) {
      throw new Error(JSON.stringify(dbResult.error))
    }

    if (!dbResult.data[0]) {
      console.error('指定されたIDのタスクが見つかりません', dbResult.error)
      return undefined
    }

    const parsedTask = dbTaskSchema.safeParse(dbResult.data[0] as Record<string, unknown>)
    if (!parsedTask.success) {
      console.error('タスク情報のパースに失敗しました', dbResult, parsedTask.error)
      return undefined
    }

    return {
      id: parsedTask.data.id,
      companyId: parsedTask.data.company_id,
      title: parsedTask.data.title,
      description: parsedTask.data.description,
      status: parsedTask.data.status,
      reasonCode: parsedTask.data.reason_code ?? undefined,
      createdUserId: parsedTask.data.created_user,
      createdAt: new Date(parsedTask.data.created_at),
      updatedAt: new Date(parsedTask.data.updated_at),
    } satisfies Task
  })

  return result
}
