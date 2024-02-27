import { supabase } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'
import { generateAdminTokenString } from '../admin-user'
import { ulid } from 'ulid'

/**
 * 管理者用トークンの発行
 */
export async function generateAdminToken(userId: string) {
  const segment = createSegment('Supabase')

  const token = await traceAsync<string>(segment, 'insert', async () => {
    const now = new Date()
    const token = generateAdminTokenString()
    const result = await supabase.from('admin_tokens').insert({
      id: ulid(),
      admin_user_id: userId,
      token,
      created_at: now,
      updated_at: now,
    })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }

    return token
  })

  return token
}
