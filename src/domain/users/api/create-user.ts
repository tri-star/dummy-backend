import { createSegment, traceAsync } from '@libs/xray-tracer'
import { type CreateUser, type User } from '../user'
import { supabase } from '@libs/supabase/api-client'

/**
 * ユーザーの登録
 */
export async function createUser(userId: string, user: CreateUser): Promise<User> {
  const segment = createSegment('Supabase')

  const createdUser = await traceAsync<User>(segment, 'insert', async () => {
    const now = new Date()
    const result = await supabase.from('users').insert({
      id: userId,
      name: user.name,
      login_id: user.loginId,
      password: user.password,
      email: user.email,
      // company_id: user.companyId,
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
      // companyId: user.companyId,
      email: user.email,
      createdAt: now,
      updatedAt: now,
    }
  })

  return createdUser
}
