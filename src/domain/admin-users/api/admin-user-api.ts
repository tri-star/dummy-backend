import { supabase } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'
import { type CreateAdminUser, type AdminUser } from '../admin-user'

/**
 * 管理者ユーザーの登録
 */
export async function createAdminUser(userId: string, user: CreateAdminUser): Promise<AdminUser> {
  const segment = createSegment('Supabase')

  const createdAdminUser = await traceAsync<AdminUser>(segment, 'insert', async () => {
    const now = new Date()
    const result = await supabase.from('admin_users').insert({
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
      email: user.email,
      loginId: user.loginId,
      createdAt: now,
      updatedAt: now,
    }
  })

  return createdAdminUser
}
