import { supabase } from '@libs/supabase/api-client'
import { type User } from '../user'

type UserListResponse = {
  data: User[]
  count: number
}

export async function fetchUsers(): Promise<UserListResponse> {
  const users = await supabase?.from('users').select('*')
  // if (users?.error != null) {
  //   throw new Error('')
  // }
  return {
    data: users.data
      ?.map((user) => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        }
      })
      .filter((user) => user !== null),
    count: users.count ?? 0,
  }
}
