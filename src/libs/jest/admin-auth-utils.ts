import { type AdminUser } from '@/domain/admin-users/admin-user'
import { generateAdminToken } from '@/domain/admin-users/api/generate-admin-token'

export async function prepareAdminUserToken(adminUser: AdminUser) {
  return await generateAdminToken(adminUser.id)
}
