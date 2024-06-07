import { type CreateTaskAdmin, type Task } from '@/domain/tasks/task'
import { supabaseClient } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'

/**
 * タスクの登録
 */
export async function createTask(taskId: string, task: CreateTaskAdmin): Promise<Task> {
  const segment = createSegment('Supabase')

  const createdTask = await traceAsync<Task>(segment, 'insert', async () => {
    const now = new Date()
    const result = await supabaseClient().from('tasks').insert({
      id: taskId,
      title: task.title,
      company_id: task.companyId,
      description: task.description,
      status: task.status,
      reason_code: task.reasonCode,
      created_user: task.createdUserId,
      created_at: now,
      updated_at: now,
    })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
    return {
      ...task,
      id: taskId,
      createdAt: now,
      updatedAt: now,
    }
  })

  return createdTask
}
