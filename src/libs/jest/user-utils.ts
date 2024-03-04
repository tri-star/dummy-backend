import { createUser } from '@/domain/users/api/create-user'
import { createPasswordHash } from '@/domain/users/user'
import { ulid } from 'ulid'

export async function prepareUser(attributes: {
  userId?: string
  loginId?: string
  email?: string
  password?: string
}) {
  attributes.userId ??= ulid()
  attributes.loginId ??= ulid()
  attributes.email ??= `${attributes.userId}@example.com`
  attributes.password ??= 'testtest'
  return await createUser(attributes.userId, {
    name: attributes.loginId,
    loginId: attributes.loginId,
    email: attributes.email,
    password: createPasswordHash(attributes.password, attributes.userId),
  })
}

export async function prepareUsers(attributes: { loginId?: string; email?: string; password?: string }, count: number) {
  const baseLoginId = attributes.loginId ?? ulid()
  for (let i = 1; i <= count; i++) {
    const userId = ulid()
    const loginId = `${baseLoginId}${i}`
    await prepareUser({
      userId,
      loginId,
      password: attributes.password,
    })
  }
}
