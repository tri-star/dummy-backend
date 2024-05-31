import { createSegment, traceAsync } from '@libs/xray-tracer'
import { type UserAuthResponse, dbAdminUserSchema } from '../admin-user'
import { supabaseClient } from '@libs/supabase/api-client'

/**
 * ユーザーをloginIdで取得する
 */
export async function fetchAdminUserForAuth(loginId: string): Promise<UserAuthResponse | undefined> {
  const segment = createSegment('Supabase')

  const user = await traceAsync<UserAuthResponse | undefined>(segment, 'query', async () => {
    const dbUserList = await supabaseClient().from('admin_users').select('*').eq('login_id', loginId)

    if (dbUserList.error != null) {
      throw new Error(JSON.stringify(dbUserList.error))
    }

    const dbUser = (dbUserList.data as unknown[])[0]
    if (dbUser == null) {
      return undefined
    }

    const adminUser = dbAdminUserSchema.safeParse(dbUser)
    if (!adminUser.success) {
      throw new Error(JSON.stringify(adminUser.error))
    }

    const result: UserAuthResponse = {
      id: adminUser.data.id,
      loginId: adminUser.data.login_id,
      password: adminUser.data.password,
    }
    return result
  })

  return user
}
