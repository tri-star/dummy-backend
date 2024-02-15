import { createSegment, traceAsync } from '@libs/xray-tracer'
import z from 'zod'
import { dbAdminUserDetailSchema, adminUserDetailSchema, type AdminUserDetail } from '../admin-user'
import { supabase } from '@libs/supabase/api-client'
import { type PostgrestFilterBuilder } from '@supabase/postgrest-js'

const adminUserListResponseSchema = z.object({
  count: z.number(),
  list: z.array(adminUserDetailSchema),
})
type AdminUserListResponse = z.infer<typeof adminUserListResponseSchema>

function buildSearchQuery(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  baseQuery: PostgrestFilterBuilder<any, any, unknown[], 'admin_users', unknown>,
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
export async function fetchAdminUserList(loginId?: string): Promise<AdminUserListResponse | undefined> {
  const segment = createSegment('Supabase')

  const result = await traceAsync<AdminUserListResponse>(segment, 'query', async () => {
    const dbUserListQuery = buildSearchQuery(supabase.from('admin_users').select('*'), loginId)
    const dbUserCountQuery = buildSearchQuery(
      supabase.from('admin_users').select('*', { count: 'exact', head: true }),
      loginId,
    )

    const dbUserList = await dbUserListQuery
    const countRecord = await dbUserCountQuery
    console.log(countRecord.count, countRecord)
    const count = countRecord.count ?? 0
    if (dbUserList.error != null) {
      throw new Error(JSON.stringify(dbUserList.error))
    }

    const list = dbUserList.data
      .map((adminUser) => {
        const parsedAdminUser = dbAdminUserDetailSchema.safeParse(adminUser)
        if (!parsedAdminUser.success) {
          console.error('ユーザー情報のパースに失敗しました', adminUser, parsedAdminUser.error)
          return undefined
        }

        return {
          id: parsedAdminUser.data.id,
          name: parsedAdminUser.data.name,
          loginId: parsedAdminUser.data.login_id,
          createdAt: new Date(parsedAdminUser.data.created_at),
          updatedAt: new Date(parsedAdminUser.data.updated_at),
        } satisfies AdminUserDetail as AdminUserDetail
      })
      .filter((user): user is AdminUserDetail => user != null)

    return {
      count,
      list: list ?? [],
    }
  })

  return result
}
