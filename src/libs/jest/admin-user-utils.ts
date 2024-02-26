import { createAdminPasswordHash } from '@/domain/admin-users/admin-user'
import { createAdminUser } from '@/domain/admin-users/api/admin-user-api'
import { ulid } from 'ulid'

export async function prepareAdminUser(attributes: { adminUserId?: string; loginId?: string; password?: string }) {
  attributes.adminUserId ??= ulid()
  attributes.loginId ??= ulid()
  attributes.password ??= 'testtest'
  return await createAdminUser(attributes.adminUserId, {
    name: attributes.loginId,
    loginId: attributes.loginId,
    password: createAdminPasswordHash(attributes.password, attributes.adminUserId),
  })
}

export async function prepareAdminUsers(attributes: { loginId?: string; password?: string }, count: number) {
  const baseLoginId = attributes.loginId ?? ulid()
  for (let i = 1; i <= count; i++) {
    const adminUserId = ulid()
    const loginId = `${baseLoginId}${i}`
    await prepareAdminUser({
      adminUserId,
      loginId,
      password: attributes.password,
    })
  }
}
