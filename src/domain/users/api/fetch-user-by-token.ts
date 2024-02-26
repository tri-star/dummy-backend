import { createSegment, traceAsync } from '@libs/xray-tracer'
import { dbUserDetailSchema, type UserDetail } from '../user'
import { supabase } from '@libs/supabase/api-client'

/**
 * トークンに合致するユーザーを取得する
 */
export async function fetchUserByToken(token: string): Promise<UserDetail | undefined> {
  const segment = createSegment('Supabase')

  const result = await traceAsync<UserDetail | undefined>(segment, 'query', async () => {
    const dbResult = await supabase.from('tokens').select('*, users(*)').eq('token', token)

    if (dbResult.error != null) {
      throw new Error(JSON.stringify(dbResult.error))
    }

    const parsedUser = dbUserDetailSchema.safeParse((dbResult.data[0] as Record<string, unknown>).users)
    if (!parsedUser.success) {
      console.error('ユーザー情報のパースに失敗しました', dbResult, parsedUser.error)
      return undefined
    }

    return {
      id: parsedUser.data.id,
      name: parsedUser.data.name,
      loginId: parsedUser.data.login_id,
      createdAt: new Date(parsedUser.data.created_at),
      updatedAt: new Date(parsedUser.data.updated_at),
      // companyId: parsedUser.data.company_id,
      email: parsedUser.data.email,
      // company: {
      //   id: parsedUser.data.companies.id,
      //   name: parsedUser.data.companies.name,
      // },
    } satisfies UserDetail
  })

  return result
}
