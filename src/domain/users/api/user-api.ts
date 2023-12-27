import { supabase } from '@libs/supabase/api-client'
import { type User, dbUserSchema, type UpdateUser } from '../user'
import dayjs from 'dayjs'
import { createSegment, traceAsync } from '@libs/xray-tracer'

export type UserListResponse = {
  data: User[]
  count: number
}

/**
 * ユーザー一覧を取得する
 */
export async function fetchUsers(): Promise<UserListResponse> {
  const segment = createSegment('Supabase')

  const users = await traceAsync<User[]>(segment, 'query', async () => {
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

    return users
  })

  return {
    data: users,
    count: users.length,
  }
}

/**
 * ユーザーの登録
 */
export async function createUser(user: User): Promise<User> {
  const segment = createSegment('Supabase')

  const createdUser = await traceAsync<User>(segment, 'insert', async () => {
    const now = new Date()
    const result = await supabase.from('users').insert({
      id: user.id,
      name: user.name,
      password: '',
      email: user.email,
      created_at: now,
      updated_at: now,
    })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
    return {
      ...user,
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
        password: '',
        email: user.email,
        updated_at: new Date(),
      })
      .match({ id: userId })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
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
