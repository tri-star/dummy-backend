import { createSegment, traceAsync } from '@libs/xray-tracer'
import { type AdminUser, type DbAdminUser } from '../admin-user'
import { supabaseClient } from '@libs/supabase/api-client'

/**
 * ログインIDが利用可能かを返す
 */
export async function validateLoginId(loginId: string, self: AdminUser | undefined): Promise<boolean> {
  const segment = createSegment('Supabase')

  const result = await traceAsync<boolean>(segment, 'query', async () => {
    const dbResult = await supabaseClient().from('admin_users').select('*').eq('login_id', loginId)

    if (dbResult.error != null) {
      throw new Error(JSON.stringify(dbResult.error))
    }

    if (dbResult.data.length === 0) {
      return true
    }

    const matchedUser = dbResult.data[0] as DbAdminUser
    if (self != null) {
      if (matchedUser.id === self.id) {
        return true
      }
    }
    return false
  })

  return result
}
