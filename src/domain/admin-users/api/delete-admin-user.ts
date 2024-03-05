import { supabase } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'

/**
 * 管理者ユーザーの削除
 */
export async function deleteAdminUser(adminUserId: string): Promise<void> {
  const segment = createSegment('Supabase')

  await traceAsync(segment, 'delete', async () => {
    const tokenDeleteResult = await supabase.from('admin_tokens').delete().eq('admin_user_id', adminUserId)
    if (tokenDeleteResult.error != null) {
      throw new Error(JSON.stringify(tokenDeleteResult.error))
    }

    const result = await supabase.from('admin_users').delete().eq('id', adminUserId)
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
  })
}
