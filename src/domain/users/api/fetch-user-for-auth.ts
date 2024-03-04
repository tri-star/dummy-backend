import { createSegment, traceAsync } from '@libs/xray-tracer'
import { dbUserSchema, type UserAuthResponse } from '../user'
import { supabase } from '@libs/supabase/api-client'

/**
 * ユーザーをloginIdで取得する
 */
export async function fetchUserForAuth(loginId: string): Promise<UserAuthResponse | undefined> {
  const segment = createSegment('Supabase')

  const user = await traceAsync<UserAuthResponse | undefined>(segment, 'query', async () => {
    const dbUserList = await supabase.from('users').select('*').eq('login_id', loginId)

    if (dbUserList.error != null) {
      throw new Error(JSON.stringify(dbUserList.error))
    }

    const dbUser = (dbUserList.data as unknown[])[0]
    if (dbUser == null) {
      return undefined
    }

    const user = dbUserSchema.safeParse(dbUser)
    if (!user.success) {
      throw new Error(JSON.stringify(user.error))
    }

    const result: UserAuthResponse = {
      id: user.data.id,
      loginId: user.data.login_id,
      password: user.data.password,
    }
    return result
  })

  return user
}
