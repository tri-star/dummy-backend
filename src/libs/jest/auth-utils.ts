import { generateToken } from '@/domain/users/api/generate-token'
import { type User } from '@/domain/users/user'

export async function prepareUserToken(user: User) {
  return await generateToken(user.id)
}
