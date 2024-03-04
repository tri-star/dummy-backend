import { supabase } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'

/**
 * ユーザーの削除
 */
export async function deleteUser(userId: string): Promise<void> {
  const segment = createSegment('Supabase')

  await traceAsync(segment, 'delete', async () => {
    const tokenDeleteResult = await supabase.from('tokens').delete().eq('user_id', userId)
    if (tokenDeleteResult.error != null) {
      throw new Error(JSON.stringify(tokenDeleteResult.error))
    }

    const result = await supabase.from('users').delete().eq('id', userId)
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
  })
}
