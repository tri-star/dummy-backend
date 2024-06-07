import { createSegment, traceAsync } from '@libs/xray-tracer'
import { type AdminUser, type CreateAdminUser } from '../admin-user'
import { supabaseClient } from '@libs/supabase/api-client'

/**
 * 管理者ユーザーの登録
 */
export async function createAdminUser(userId: string, user: CreateAdminUser): Promise<AdminUser> {
  const segment = createSegment('Supabase')

  const createdAdminUser = await traceAsync<AdminUser>(segment, 'insert', async () => {
    const now = new Date()
    const result = await supabaseClient().from('admin_users').insert({
      id: userId,
      name: user.name,
      login_id: user.loginId,
      password: user.password,
      created_at: now,
      updated_at: now,
    })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
    return {
      id: userId,
      name: user.name,
      loginId: user.loginId,
      createdAt: now,
      updatedAt: now,
    }
  })

  return createdAdminUser
}
