import { supabase } from '@libs/supabase/api-client'
import { adminLoginHandler } from '../handler'
import { createAdminUser } from '@/domain/admin-users/api/admin-user-api'
import { ulid } from 'ulid'
import { type VersionedApiGatewayEvent } from '@middy/http-json-body-parser'
import { type Context } from 'aws-lambda'
import { parseHandlerJsonResponse } from '@/utils/jest'
import { createAdminPasswordHash } from '@/domain/admin-users/admin-user'

beforeEach(async () => {
  await supabase.from('admin_tokens').delete()
  await supabase.from('admin_users').delete()
})

describe('admin-auth-handler', () => {
  test('トークン発行が成功すること', async () => {
    const adminUserId = ulid()
    const password = 'testtest'
    const user = await createAdminUser(adminUserId, {
      name: 'test',
      email: '',
      loginId: 'test',
      password: createAdminPasswordHash(password, adminUserId),
    })

    const result = await adminLoginHandler(
      {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: user.loginId,
          password,
        }),
      } as unknown as VersionedApiGatewayEvent,
      undefined as unknown as Context,
    )

    const { statusCode, body } = parseHandlerJsonResponse<{ token: string }>(result)
    expect(statusCode).toBe(200)
    expect(body.token).toHaveLength(30)
  })

  test('認証に失敗した場合403レスポンスが返ること', async () => {
    const adminUserId = ulid()
    const password = 'testtest'
    const wrongPassword = 'wrongPassword'
    const user = await createAdminUser(adminUserId, {
      name: 'test',
      email: '',
      loginId: 'test',
      password: createAdminPasswordHash(password, adminUserId),
    })

    const result = await adminLoginHandler(
      {
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: user.loginId,
          password: wrongPassword,
        }),
      } as unknown as VersionedApiGatewayEvent,
      undefined as unknown as Context,
    )

    const { statusCode, body } = parseHandlerJsonResponse<{ token: string }>(result)
    expect(body.token).toBeUndefined()
    expect(statusCode).toBe(403)
  })
})
