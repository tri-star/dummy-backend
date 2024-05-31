import { createSegment, traceAsync } from '@libs/xray-tracer'
import z from 'zod'
import { dbUserDetailSchema, userDetailSchema, type UserDetail } from '../user'
import { supabaseClient } from '@libs/supabase/api-client'
import { type PostgrestFilterBuilder } from '@supabase/postgrest-js'

const userListResponseSchema = z.object({
  count: z.number(),
  list: z.array(userDetailSchema),
})
type userListResponse = z.infer<typeof userListResponseSchema>

function buildSearchQuery(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseQuery: PostgrestFilterBuilder<any, any, unknown[], 'users', unknown>,
  loginId?: string,
) {
  if (loginId != null) {
    baseQuery = baseQuery.like('login_id', loginId)
  }
  return baseQuery
}

/**
 * ユーザーをloginIdで取得する
 */
export async function fetchUserList(loginId?: string): Promise<userListResponse | undefined> {
  const segment = createSegment('Supabase')

  const result = await traceAsync<userListResponse>(segment, 'query', async () => {
    const dbUserListQuery = buildSearchQuery(supabaseClient().from('users').select('*'), loginId)
    const dbUserCountQuery = buildSearchQuery(
      supabaseClient().from('users').select('*', { count: 'exact', head: true }),
      loginId,
    )

    const dbUserList = await dbUserListQuery
    const countRecord = await dbUserCountQuery
    const count = countRecord.count ?? 0
    if (dbUserList.error != null) {
      throw new Error(JSON.stringify(dbUserList.error))
    }

    const list = dbUserList.data
      .map((user) => {
        const parsedUser = dbUserDetailSchema.safeParse(user)
        if (!parsedUser.success) {
          console.error('ユーザー情報のパースに失敗しました', user, parsedUser.error)
          return undefined
        }

        return {
          id: parsedUser.data.id,
          name: parsedUser.data.name,
          loginId: parsedUser.data.login_id,
          email: parsedUser.data.email,
          createdAt: new Date(parsedUser.data.created_at),
          updatedAt: new Date(parsedUser.data.updated_at),
        } as UserDetail
      })
      .filter((user): user is UserDetail => user != null)

    return {
      count,
      list,
    }
  })

  return result
}
