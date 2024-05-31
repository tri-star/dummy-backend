import { createSegment, traceAsync } from '@libs/xray-tracer'
import { type UserDetail, dbUserDetailSchema } from '../user'
import { supabaseClient } from '@libs/supabase/api-client'
import { NotFoundError } from '@/errors/not-found'
import dayjs from 'dayjs'

/**
 * ユーザーを取得する
 */
export async function fetchUser(userId: string): Promise<UserDetail> {
  const segment = createSegment('Supabase')

  const user = await traceAsync<UserDetail>(segment, 'query', async () => {
    const dbUserList = await supabaseClient().from('users').select('*').eq('id', userId)

    if (dbUserList.error != null) {
      throw new Error(JSON.stringify(dbUserList.error))
    }

    const dbUser = (dbUserList.data as unknown[])[0]
    if (dbUser == null) {
      throw new NotFoundError('ユーザーが見つかりません')
    }

    const parseResult = dbUserDetailSchema.safeParse(dbUser)
    if (!parseResult.success) {
      console.error(parseResult.error.errors)
      throw new Error('無効なユーザーデータです')
    }

    const result: UserDetail = {
      id: parseResult.data.id,
      name: parseResult.data.name,
      loginId: parseResult.data.login_id,
      email: parseResult.data.email,
      // companyId: parseResult.data.company_id,
      // company: {
      //   id: parseResult.data.companies.id,
      //   name: parseResult.data.companies.name,
      // },
      createdAt: dayjs(parseResult.data.created_at).toDate(),
      updatedAt: dayjs(parseResult.data.updated_at).toDate(),
    }
    return result
  })

  return user
}
