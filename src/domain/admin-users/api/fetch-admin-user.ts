import { createSegment, traceAsync } from '@libs/xray-tracer'
import { dbAdminUserDetailSchema, type AdminUserDetail } from '../admin-user'
import { supabaseClient } from '@libs/supabase/api-client'

/**
 * 管理者ユーザーを取得する
 */
export async function fetchAdminUser(adminUserId: string): Promise<AdminUserDetail | undefined> {
  const segment = createSegment('Supabase')

  const result = await traceAsync<AdminUserDetail | undefined>(segment, 'query', async () => {
    const dbResult = await supabaseClient().from('admin_users').select('*').eq('id', adminUserId)

    if (dbResult.error != null) {
      throw new Error(JSON.stringify(dbResult.error))
    }

    const parsedAdminUser = dbAdminUserDetailSchema.safeParse(dbResult.data[0] as Record<string, unknown>)
    if (!parsedAdminUser.success) {
      console.error('ユーザー情報のパースに失敗しました', dbResult, parsedAdminUser.error)
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

  return result
}
