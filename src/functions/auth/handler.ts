import { fetchUserForAuth } from '@/domain/users/api/fetch-user-for-auth'
import { generateToken } from '@/domain/users/api/generate-token'
import { createPasswordHash } from '@/domain/users/user'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import createHttpError from 'http-errors'

/**
 * 一般ユーザー用ログイン
 */
export const loginHandler = middyfy(async (event: APIGatewayProxyEvent) => {
  const json = event.body as unknown as Record<string, unknown>
  const loginId = String(json.loginId ?? '')
  const password = String(json.password ?? '')

  if (loginId === '') {
    throw new createHttpError.BadRequest('loginIdが入力されていません')
  }
  if (password === '') {
    throw new createHttpError.BadRequest('passwordが入力されていません')
  }

  const user = await fetchUserForAuth(loginId)
  if (user === undefined) {
    throw new createHttpError.Unauthorized('ログインに失敗しました')
  }

  const hashedPassword = user.password
  if (hashedPassword !== createPasswordHash(password, user.id)) {
    throw new createHttpError.Unauthorized('ログインに失敗しました')
  }

  const token = await generateToken(user.id)

  const response = formatJSONResponse({
    token,
  })
  return response
})
