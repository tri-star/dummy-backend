import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { createAdminUser } from '@/domain/admin-users/api/admin-user-api'
import {
  type CreateAdminUser,
  createAdminPasswordHash,
  createAdminUserSchema,
  adminUserDetailSchema,
} from '@/domain/admin-users/admin-user'
import { ulid } from 'ulid'
import z from 'zod'
import { type AdminApiContext, middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { fetchAdminUserList } from '@/domain/admin-users/api/fetch-admin-user-list'

type CreateAdminUserNoAuthPayload = CreateAdminUser

/**
 * 登録(管理者用で、登録にトークンが不要)
 */
export const createAdminUserNoAuthHandler = async (event: CreateAdminUserNoAuthPayload) => {
  const parseResult = createAdminUserSchema.safeParse(event)
  if (!parseResult.success) {
    console.error('createAdminUserNoAuthHandler error', parseResult.error.errors)
    return formatJSONUserErrorResponse({ errors: parseResult.error.errors })
  }

  const user = parseResult.data

  const userId = ulid()
  try {
    const hashedPassword = createAdminPasswordHash(user.password, userId)
    const createdUser = await createAdminUser(userId, {
      name: user.name,
      loginId: user.loginId,
      password: hashedPassword,
    })
    return formatJSONResponse({ data: createdUser })
  } catch (e) {
    console.error('createAdminUserNoAuthHandler error', e)
    return formatJSONUserErrorResponse({ errors: ['ユーザー登録に失敗しました'] })
  }
}

const listAdminUsersRequestSchema = z.object({
  loginId: z.string().optional(),
  page: z.number().optional(),
  offset: z.number().optional(),
})

const listAdminUsersResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(adminUserDetailSchema),
  count: z.number(),
})
export type ListAdminUsersResponse = z.infer<typeof listAdminUsersResponseSchema>

/**
 * 管理者一覧
 */
export const listAdminUsersHandler = middyfyWithAdminAuth(
  async (event: APIGatewayProxyEvent, context: AdminApiContext) => {
    try {
      const parsed = listAdminUsersRequestSchema.safeParse(JSON.parse(event.body ?? '{}'))
      if (!parsed.success) {
        return formatJSONUserErrorResponse({ error: parsed.error })
      }
      const { loginId /* page, offset */ } = parsed.data

      const userListResponse = await fetchAdminUserList(loginId)
      return formatJSONResponse({
        success: true,
        data: userListResponse?.list ?? [],
        count: userListResponse?.count ?? 0,
      } satisfies ListAdminUsersResponse)
    } catch (e) {
      console.error(e)
      return formatJSONUserErrorResponse({ error: e })
    }
  },
)
