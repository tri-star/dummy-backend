import * as z from 'zod'

/**
 * アプリケーション内部で利用するユーザー
 */
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})
export type User = z.infer<typeof userSchema>

/**
 * データ更新用のスキーマ
 */
export const updateUserSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true })
export type UpdateUser = z.infer<typeof updateUserSchema>

/**
 * DBから取得するユーザー情報
 */
export const dbUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type DbUser = z.infer<typeof dbUserSchema>
