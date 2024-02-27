import { fetchUserForAuth } from '@/domain/users/api/fetch-user-for-auth'
import { generateToken } from '@/domain/users/api/generate-token'
import { createPasswordHash } from '@/domain/users/user'
import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'

/**
 * 一般ユーザー用ログイン
 */
export const loginHandler = middyfy(async (event: APIGatewayProxyEvent) => {
  try {
    const json = event.body as unknown as Record<string, unknown>
    const loginId = String(json.loginId ?? '')
    const password = String(json.password ?? '')

    if (loginId === '') {
      return formatJSONUserErrorResponse({ error: new Error('loginIdが入力されていません') })
    }
    if (password === '') {
      return formatJSONUserErrorResponse({ error: new Error('passwordが入力されていません') })
    }

    const user = await fetchUserForAuth(loginId)
    if (user === undefined) {
      return formatJSONResponse({ error: 'ログインに失敗しました' }, 401)
    }

    const hashedPassword = user.password
    if (hashedPassword !== createPasswordHash(password, user.id)) {
      return formatJSONResponse({ error: 'ログインに失敗しました' }, 401)
    }

    const token = await generateToken(user.id)

    const response = formatJSONResponse({
      token,
    })
    return response
  } catch (e) {
    console.error(e)
    return formatJSONUserErrorResponse({ error: (e as Error).message })
  }
})
