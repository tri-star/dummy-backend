import { createSegment, traceAsync } from '@libs/xray-tracer'
import { type UpdateUser } from '../user'
import { supabaseClient } from '@libs/supabase/api-client'

/**
 * ユーザーの更新
 */
export async function updateUser(userId: string, user: UpdateUser): Promise<void> {
  const segment = createSegment('Supabase')

  await traceAsync(segment, 'update', async () => {
    const result = await supabaseClient()
      .from('users')
      .update({
        name: user.name,
        login_id: user.loginId,
        email: user.email,
        // company_id: user.companyId,
        updated_at: new Date(),
      })
      .match({ id: userId })
    if (result.error != null) {
      throw new Error(result.error.message)
    }
  })
}
