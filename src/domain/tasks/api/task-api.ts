import { dbTaskSchema, type UpdateTask, type Task } from '@/domain/tasks/task'
import { supabase } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'
import dayjs from 'dayjs'

export type TaskListResponse = {
  data: Task[]
  count: number
}

/**
 * タスク一覧を取得する
 */
export async function fetchTasks(): Promise<TaskListResponse> {
  const segment = createSegment('Supabase')

  const tasks = await traceAsync<Task[]>(segment, 'query', async () => {
    const dbTasksList = await supabase.from('tasks').select('*')

    if (dbTasksList.error != null) {
      throw new Error(JSON.stringify(dbTasksList.error))
    }

    const tasks: Task[] =
      dbTasksList.data
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
            status: parseResult.data.status,
            reasonCode: parseResult.data.reason_code ?? undefined,
            createdAt: dayjs(parseResult.data.created_at).toDate(),
            updatedAt: dayjs(parseResult.data.updated_at).toDate(),
          } as Task
        })
        .filter((task): task is Task => task !== undefined) ?? []

    return tasks
  })

  return {
    data: tasks,
    count: tasks.length,
  }
}

/**
 * タスクの登録
 */
export async function createTask(task: Task): Promise<Task> {
  const segment = createSegment('Supabase')

  const createdTask = await traceAsync<Task>(segment, 'insert', async () => {
    const now = new Date()
    const result = await supabase.from('tasks').insert({
      id: task.id,
      title: task.title,
      company_id: task.companyId,
      description: task.description,
      status: task.status,
      reason_code: task.reasonCode,
      created_user: task.createdUser,
      created_at: now,
      updated_at: now,
    })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
    return {
      ...task,
      createdAt: now,
      updatedAt: now,
    }
  })

  return createdTask
}

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
