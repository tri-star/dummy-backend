import { supabase } from '@libs/supabase/api-client'
import { type User, type UpdateUser } from '../user'
import { createSegment, traceAsync } from '@libs/xray-tracer'

export type UserListResponse = {
  data: User[]
  count: number
}

/**
 * ユーザーの更新
 */
export async function updateUser(userId: string, user: UpdateUser): Promise<void> {
  const segment = createSegment('Supabase')

  await traceAsync(segment, 'update', async () => {
    const result = await supabase
      .from('users')
      .update({
        name: user.name,
        loginId: user.loginId,
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
