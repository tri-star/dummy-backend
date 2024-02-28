import { supabase } from '@libs/supabase/api-client'
import { type User } from '../user'
import { createSegment, traceAsync } from '@libs/xray-tracer'

export type UserListResponse = {
  data: User[]
  count: number
}

/**
 * ユーザーの削除
 */
export async function deleteUser(userId: string): Promise<void> {
  const segment = createSegment('Supabase')

  await traceAsync(segment, 'delete', async () => {
    const result = await supabase.from('users').delete().match({ id: userId })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
  })
}
