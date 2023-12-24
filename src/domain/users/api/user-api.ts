import { supabase } from '@libs/supabase/api-client'
import { type User, dbUserSchema } from '../user'
import dayjs from 'dayjs'

export type UserListResponse = {
  data: User[]
  count: number
}

/**
 * ユーザー一覧を取得する
 * @param _
 */
export async function fetchUsers(): Promise<UserListResponse> {
  const dbUserList = await supabase.from('users').select('*')

  if (dbUserList.error != null) {
    throw new Error(JSON.stringify(dbUserList.error))
  }

  const users: User[] =
    dbUserList.data
      ?.map((dbUserJson) => {
        const parseResult = dbUserSchema.safeParse(dbUserJson)
        if (!parseResult.success) {
          console.error(parseResult.error.errors)
          return undefined
        }
        return {
          id: parseResult.data.id,
          name: parseResult.data.name,
          email: parseResult.data.email,
          createdAt: dayjs(parseResult.data.created_at).toDate(),
          updatedAt: dayjs(parseResult.data.updated_at).toDate(),
        } as User
      })
      .filter((user): user is User => user !== undefined) ?? []

  return {
    data: users,
    count: users.length,
  }
}

export async function createUser(user: User): Promise<void> {
  const dbUser = dbUserSchema.parse({
    id: user.id,
    name: user.name,
    password: '',
    email: user.email,
    created_at: user.createdAt?.toISOString(),
    updated_at: user.updatedAt?.toISOString(),
  })
  const result = await supabase.from('users').insert(dbUser)
  if (result.error != null) {
    throw new Error(JSON.stringify(result.error))
  }
}
