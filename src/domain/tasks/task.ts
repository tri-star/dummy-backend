import z, { string } from 'zod'

export const TASK_STATUS = {
  BACKLOG: 'BackLog',
  TODO: '未着手',
  IN_PROGRESS: '作業中',
  HOLD: '保留',
  DONE: '完了',
} as const

type TaskStatus = typeof TASK_STATUS

export const TASK_STATUS_CODES: { [K in keyof TaskStatus]: K } = Object.fromEntries(
  Object.entries(TASK_STATUS).map(([key]) => [key, key]),
) as { [K in keyof TaskStatus]: K }

const [firstTaskStatus, ...restTaskStatus] = Object.keys(TASK_STATUS)
export const taskStatusSchema = z.enum([firstTaskStatus, ...restTaskStatus])

export const TASK_REAZONS = {
  POSTPONED: '見送り',
  INVALID: '無効',
  DUPLICATED: '重複',
  DONE: '作業完了',
} as const
const [firstReasonCode, ...restReasonCode] = Object.keys(TASK_REAZONS)

// https://github.com/colinhacks/zod/discussions/839#discussioncomment-4335236
export const taskReasonCodeSchema = z.enum([firstReasonCode, ...restReasonCode])

export const taskSchema = z.object({
  id: z.string(), // ULID
  companyId: string(),
  title: z.string(),
  description: z.string(),
  status: taskStatusSchema,
  reasonCode: taskReasonCodeSchema.optional(),
  createdUserId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})
export type Task = z.infer<typeof taskSchema>

export const createTaskSchema = taskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdUserId: true,
  companyId: true,
})
export type CreateTask = z.infer<typeof createTaskSchema>

export const createTaskAdminSchema = taskSchema.omit({ id: true, createdAt: true, updatedAt: true })
export type CreateTaskAdmin = z.infer<typeof createTaskAdminSchema>

export const updateTaskSchema = taskSchema.omit({
  id: true,
  companyId: true,
  createdUserId: true,
  createdAt: true,
  updatedAt: true,
})
export type UpdateTask = z.infer<typeof updateTaskSchema>

export const dbTaskSchema = z.object({
  id: z.string(), // ULID
  company_id: string(),
  title: z.string(),
  description: z.string(),
  status: taskStatusSchema,
  reason_code: taskReasonCodeSchema.nullable(),
  created_user: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type DbTask = z.infer<typeof dbTaskSchema>
