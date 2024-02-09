import * as z from 'zod'
import crypto from 'crypto'

/**
 * アプリケーション内部で利用する管理者ユーザー
 */
export const adminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  loginId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})
export type AdminUser = z.infer<typeof adminUserSchema>

/**
 * ログイン認証用のスキーマ
 */
export const userAuthResponseSchema = z.object({
  id: z.string(),
  loginId: z.string(),
  password: z.string(),
})
export type UserAuthResponse = z.infer<typeof userAuthResponseSchema>

/**
 * 管理者ユーザー詳細情報用スキーマ
 */
export const adminUserDetailSchema = adminUserSchema
export type AdminUserDetail = z.infer<typeof adminUserDetailSchema>

/**
 * データ登録用のスキーマ
 */
export const createAdminUserSchema = adminUserSchema.omit({ id: true, createdAt: true, updatedAt: true }).extend({
  password: z.string().min(8).max(100),
})
export type CreateAdminUser = z.infer<typeof createAdminUserSchema>

/**
 * データ更新用のスキーマ
 */
export const updateAdminUserSchema = adminUserSchema.omit({ id: true, createdAt: true, updatedAt: true })
export type UpdateAdminUser = z.infer<typeof updateAdminUserSchema>

/**
 * DBから取得するユーザー情報
 */
export const dbAdminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  login_id: z.string(),
  password: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type DbAdminUser = z.infer<typeof dbAdminUserSchema>

export const dbAdminUserDetailSchema = dbAdminUserSchema
export type DbAdminUserDetail = z.infer<typeof dbAdminUserDetailSchema>

export function createAdminPasswordHash(password: string, userId: string) {
  const appKey = process.env.APP_KEY
  return crypto
    .createHash('sha256')
    .update(appKey + '##' + password + '##' + userId)
    .digest('hex')
}

export function generateAdminTokenString(): string {
  const tokenLength = 30
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < tokenLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
