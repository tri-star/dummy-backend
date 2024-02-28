import { supabase } from '@libs/supabase/api-client'
import { type User, type UpdateUser, type CreateUser } from '../user'
import { createSegment, traceAsync } from '@libs/xray-tracer'

export type UserListResponse = {
  data: User[]
  count: number
}

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
