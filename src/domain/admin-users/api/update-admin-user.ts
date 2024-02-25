import { supabase } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'
import { type AdminUser, type UpdateAdminUser } from '../admin-user'

/**
 * 管理者ユーザーの更新
 */
export async function updateAdminUser(adminUserId: string, user: UpdateAdminUser): Promise<void> {
  const segment = createSegment('Supabase')

  await traceAsync<AdminUser>(segment, 'insert', async () => {
    const now = new Date()
    const result = await supabase
      .from('admin_users')
      .update({
        name: user.name,
        login_id: user.loginId,
        updated_at: now,
      })
      .eq('id', adminUserId)
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
    return {
      id: adminUserId,
      name: user.name,
      loginId: user.loginId,
      createdAt: now,
      updatedAt: now,
    }
  })
}
