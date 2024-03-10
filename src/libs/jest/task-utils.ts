import { createTask } from '@/domain/tasks/api/create-task'
import { TASK_STATUS_CODES } from '@/domain/tasks/task'
import { ulid } from 'ulid'

export async function prepareTask(attributes: {
  id?: string
  companyId: string
  title?: string
  description?: string
  status?: string
  reasonCode?: string | undefined
  createdUserId?: string
}) {
  attributes.id ??= ulid()
  attributes.title ??= 'デフォルトタイトル'
  attributes.description ??= 'デフォルトの説明文'
  attributes.status ??= TASK_STATUS_CODES.TODO
  attributes.reasonCode ??= undefined
  attributes.createdUserId ??= ulid() // このフィールドは実際のアプリケーションでは異なる方法で設定するかもしれません。
  return await createTask(attributes.id, {
    companyId: attributes.companyId,
    title: attributes.title,
    description: attributes.description,
    status: attributes.status,
    reasonCode: attributes.reasonCode,
    createdUserId: attributes.createdUserId,
  })
}

export async function prepareTasks(
  companyId: string,
  attributes: {
    title?: string
    description?: string
    status?: string
    reasonCode?: string | undefined
    createdUserId?: string
  },
  count: number,
) {
  const tasks = []
  for (let i = 1; i <= count; i++) {
    const taskAttributes = {
      ...attributes,
      title: attributes.title ?? `タスクタイトル${i}`,
    }
    const task = await prepareTask({
      ...taskAttributes,
      companyId,
    })
    tasks.push(task)
  }
  return tasks
}
