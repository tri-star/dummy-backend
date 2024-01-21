import { supabase } from '@libs/supabase/api-client'
import { type User, dbUserSchema, type UpdateUser, type CreateUser, type UserDetail, dbUserDetailSchema } from '../user'
import dayjs from 'dayjs'
import { createSegment, traceAsync } from '@libs/xray-tracer'
import { NotFoundError } from '@/errors/not-found'

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
            companyId: parseResult.data.company_id,
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
 * ユーザーを取得する
 */
export async function fetchUser(userId: string): Promise<UserDetail> {
  const segment = createSegment('Supabase')

  const user = await traceAsync<UserDetail>(segment, 'query', async () => {
    const dbUserList = await supabase.from('users').select('*, companies(id, name)').eq('id', userId)

    if (dbUserList.error != null) {
      throw new Error(JSON.stringify(dbUserList.error))
    }

    const dbUser = (dbUserList.data as unknown[])[0]
    console.log('user', dbUser)
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
      email: parseResult.data.email,
      companyId: parseResult.data.company_id,
      company: {
        id: parseResult.data.companies.id,
        name: parseResult.data.companies.name,
      },
      createdAt: dayjs(parseResult.data.created_at).toDate(),
      updatedAt: dayjs(parseResult.data.updated_at).toDate(),
    }
    return result
  })

  return user
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
      password: user.password,
      email: user.email,
      company_id: user.companyId,
      created_at: now,
      updated_at: now,
    })
    if (result.error != null) {
      throw new Error(JSON.stringify(result.error))
    }
    return {
      id: userId,
      name: user.name,
      companyId: user.companyId,
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
        email: user.email,
        company_id: user.companyId,
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
