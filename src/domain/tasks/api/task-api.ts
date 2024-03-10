import { type UpdateTask } from '@/domain/tasks/task'
import { supabase } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'

/**
 * タスクの更新
 */
export async function updateTask(taskId: string, task: UpdateTask): Promise<void> {
  const segment = createSegment('Supabase')

  await traceAsync(segment, 'update', async () => {
    const result = await supabase
      .from('tasks')
      .update({
        title: task.title,
        description: task.description,
        status: task.status,
        reason_code: task.reasonCode,
        updated_at: new Date(),
      })
      .match({ id: taskId })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
  })
}

/**
 * タスクの削除
 */
export async function deleteTask(taskId: string): Promise<void> {
  const segment = createSegment('Supabase')

  await traceAsync(segment, 'delete', async () => {
    const result = await supabase.from('tasks').delete().match({ id: taskId })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
  })
}
