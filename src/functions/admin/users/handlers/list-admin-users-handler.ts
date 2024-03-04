import { formatJSONResponse } from '@libs/api-gateway'
import { adminUserDetailSchema } from '@/domain/admin-users/admin-user'
import z from 'zod'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { fetchAdminUserList } from '@/domain/admin-users/api/fetch-admin-user-list'
import createHttpError from 'http-errors'

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
export const listAdminUsersHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const parsed = listAdminUsersRequestSchema.safeParse(JSON.parse(event.body ?? '{}'))
  if (!parsed.success) {
    throw new createHttpError.BadRequest()
  }
  const { loginId /* page, offset */ } = parsed.data

  const userListResponse = await fetchAdminUserList(loginId)
  return formatJSONResponse({
    success: true,
    data: userListResponse?.list ?? [],
    count: userListResponse?.count ?? 0,
  } satisfies ListAdminUsersResponse)
})
