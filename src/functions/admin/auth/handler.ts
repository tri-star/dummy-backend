import { createAdminPasswordHash } from '@/domain/admin-users/admin-user'
import { fetchAdminUserForAuth, generateAdminToken } from '@/domain/admin-users/api/admin-user-api'
import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'

/**
 * 管理者用ログイン
 */
export const adminLoginHandler = middyfy(async (event: APIGatewayProxyEvent) => {
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

    const user = await fetchAdminUserForAuth(loginId)
    if (user === undefined) {
      return formatJSONResponse({ error: 'ログインに失敗しました' }, 401)
    }

    const hashedPassword = user.password
    if (hashedPassword !== createAdminPasswordHash(password, user.id)) {
      return formatJSONResponse({ error: 'ログインに失敗しました' }, 401)
    }

    const token = await generateAdminToken(user.id)

    const response = formatJSONResponse({
      token,
    })
    return response
  } catch (e) {
    console.error(e)
    return formatJSONUserErrorResponse({ error: (e as Error).message })
  }
})
