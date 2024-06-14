import { fetchAdminUserByToken } from '@/domain/admin-users/api/fetch-admin-user-by-token'
import { type AdminAppContext } from '@functions/admin-app'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

export const adminAuthenticateMiddleware = createMiddleware<AdminAppContext>(async (c, next) => {
  const noAuthRoutes = [
    '/admin/auth/login', //
    '/admin/auth/logout',
    '/admin/auth/validate-login-id',
    '/admin/swagger-docs',
    '/admin/docs',
  ]

  const isNoAuth = noAuthRoutes.some((pattern) => c.req.path.startsWith(pattern))

  const authHeader = c.req.header('Authorization')

  if (!authHeader) {
    if (isNoAuth) {
      await next()
      return
    }
    throw new HTTPException(401, { message: 'Authorization header is missing' })
  }

  const match = authHeader.match(/^Bearer (.*)$/)
  const token = match?.[1] ?? ''
  const adminUser = await fetchAdminUserByToken(token)
  if (adminUser == null) {
    if (isNoAuth) {
      await next()
      return
    }
    throw new HTTPException(401, { message: '無効なトークンが指定されました' })
  }

  c.set('adminUser', adminUser)

  await next()
})
