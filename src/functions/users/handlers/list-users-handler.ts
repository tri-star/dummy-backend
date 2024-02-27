import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import z from 'zod'
import { middyfyWithAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { userDetailSchema } from '@/domain/users/user'
import { fetchUserList } from '@/domain/users/api/fetch-user-list'

const listUsersRequestSchema = z.object({
  loginId: z.string().optional(),
  page: z.number().optional(),
  offset: z.number().optional(),
})

const listUsersResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(userDetailSchema),
  count: z.number(),
})
export type ListUsersResponse = z.infer<typeof listUsersResponseSchema>

/**
 * ユーザー一覧
 */
export const listUsersHandler = middyfyWithAuth(async (event: APIGatewayProxyEvent) => {
  try {
    const parsed = listUsersRequestSchema.safeParse(JSON.parse(event.body ?? '{}'))
    if (!parsed.success) {
      return formatJSONUserErrorResponse({ error: parsed.error })
    }
    const { loginId /* page, offset */ } = parsed.data

    const userListResponse = await fetchUserList(loginId)
    return formatJSONResponse({
      success: true,
      data: userListResponse?.list ?? [],
      count: userListResponse?.count ?? 0,
    } satisfies ListUsersResponse)
  } catch (e) {
    console.error(e)
    return formatJSONUserErrorResponse({ error: e })
  }
})
