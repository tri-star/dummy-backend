import { createSegment, traceAsync } from '@libs/xray-tracer'
import { generateTokenString } from '../user'
import { supabase } from '@libs/supabase/api-client'
import { ulid } from 'ulid'

/**
 * 一般ユーザー用トークンの発行
 */
export async function generateToken(userId: string) {
  const segment = createSegment('Supabase')

  const token = await traceAsync<string>(segment, 'insert', async () => {
    const now = new Date()
    const token = generateTokenString()
    const result = await supabase.from('tokens').insert({
      id: ulid(),
      user_id: userId,
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
