import { z } from '@hono/zod-openapi'
import crypto from 'crypto'

/**
 * アプリケーション内部で利用するユーザー
 */
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  loginId: z.string(),
  email: z.string().email(),
  // companyId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})
export type User = z.infer<typeof userSchema>

/**
 * ユーザー詳細情報用スキーマ
 */
export const userDetailSchema = userSchema.extend({
  // company: z.object({
  //   id: z.string(),
  //   name: z.string(),
  // }),
})
export type UserDetail = z.infer<typeof userDetailSchema>

/**
 * データ登録用のスキーマ
 */
export const createUserSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true }).extend({
  password: z.string().min(8).max(100),
})
export type CreateUser = z.infer<typeof createUserSchema>

/**
 * データ更新用のスキーマ
 */
export const updateUserSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true })
export type UpdateUser = z.infer<typeof updateUserSchema>

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
 * DBから取得するユーザー情報
 */
export const dbUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  login_id: z.string(),
  // company_id: z.string(),
  password: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type DbUser = z.infer<typeof dbUserSchema>

export const dbUserDetailSchema = dbUserSchema.extend({
  // companies: z.object({
  //   id: z.string(),
  //   name: z.string(),
  // }),
})
export type DbUserDetail = z.infer<typeof dbUserDetailSchema>

export function createPasswordHash(password: string, userId: string) {
  const appKey = process.env.APP_KEY
  return crypto
    .createHash('sha256')
    .update(appKey + '#' + password + '#' + userId)
    .digest('hex')
}

export function generateTokenString(): string {
  const tokenLength = 30
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < tokenLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
