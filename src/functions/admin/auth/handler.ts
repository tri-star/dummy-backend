import { createAdminPasswordHash } from '@/domain/admin-users/admin-user'
import { fetchAdminUserForAuth } from '@/domain/admin-users/api/fetch-admin-user-for-auth'
import { generateAdminToken } from '@/domain/admin-users/api/generate-admin-token'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'

/**
 * 管理者用ログイン
 */
export const adminLoginHandler = middyfy(async (event: APIGatewayProxyEvent) => {
  const json = event.body as unknown as Record<string, unknown>
  const loginId = String(json.loginId ?? '')
  const password = String(json.password ?? '')

  if (loginId === '') {
    throw createHttpError.BadRequest('loginIdが入力されていません')
  }
  if (password === '') {
    throw createHttpError.BadRequest('passwordが入力されていません')
  }

  const user = await fetchAdminUserForAuth(loginId)
  if (user === undefined) {
    throw createHttpError.Unauthorized('ログインに失敗しました')
  }

  const hashedPassword = user.password
  if (hashedPassword !== createAdminPasswordHash(password, user.id)) {
    throw createHttpError.Unauthorized('ログインに失敗しました')
  }

  const token = await generateAdminToken(user.id)

  const response = formatJSONResponse({
    token,
  })
  return response
})
