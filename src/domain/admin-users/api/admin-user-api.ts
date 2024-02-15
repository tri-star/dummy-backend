import { supabase } from '@libs/supabase/api-client'
import { createSegment, traceAsync } from '@libs/xray-tracer'
import { type CreateAdminUser, type AdminUser, generateAdminTokenString, dbAdminUserSchema } from '../admin-user'
import { ulid } from 'ulid'
import { type UserAuthResponse } from '@/domain/admin-users/admin-user'

/**
 * 管理者ユーザーの登録
 */
export async function createAdminUser(userId: string, user: CreateAdminUser): Promise<AdminUser> {
  const segment = createSegment('Supabase')

  const createdAdminUser = await traceAsync<AdminUser>(segment, 'insert', async () => {
    const now = new Date()
    const result = await supabase.from('admin_users').insert({
      id: userId,
      name: user.name,
      login_id: user.loginId,
      password: user.password,
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
      createdAt: now,
      updatedAt: now,
    }
  })

  return createdAdminUser
}

/**
 * ユーザーをloginIdで取得する
 */
export async function fetchAdminUserForAuth(loginId: string): Promise<UserAuthResponse | undefined> {
  const segment = createSegment('Supabase')

  const user = await traceAsync<UserAuthResponse | undefined>(segment, 'query', async () => {
    const dbUserList = await supabase.from('admin_users').select('*').eq('login_id', loginId)

    if (dbUserList.error != null) {
      throw new Error(JSON.stringify(dbUserList.error))
    }

    const dbUser = (dbUserList.data as unknown[])[0]
    if (dbUser == null) {
      return undefined
    }

    const adminUser = dbAdminUserSchema.safeParse(dbUser)
    if (!adminUser.success) {
      throw new Error(JSON.stringify(adminUser.error))
    }

    const result: UserAuthResponse = {
      id: adminUser.data.id,
      loginId: adminUser.data.login_id,
      password: adminUser.data.password,
    }
    return result
  })

  return user
}

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
