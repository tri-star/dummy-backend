import { fetchAdminUserByToken } from '@/domain/admin-users/api/fetch-admin-user-by-token'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

export const adminAuthenticateMiddleware = createMiddleware(async (c, next) => {
  console.log('auth middleware')

  const noAuthRoutes = [
    '/admin/auth/login', //
    '/admin/auth/logout',
    '/admin/swagger-docs',
    '/admin/docs',
  ]

  const isNoAuth = noAuthRoutes.some((pattern) => c.req.path.startsWith(pattern))

  if (isNoAuth) {
    await next()
    return
  }

  const authHeader = c.req.header('Authorization')

  if (!authHeader) {
    throw new HTTPException(401, { message: 'Authorization header is missing' })
  }

  const match = authHeader.match(/^Bearer (.*)$/)
  const token = match?.[1] ?? ''
  const adminUser = await fetchAdminUserByToken(token)
  if (adminUser == null) {
    throw new HTTPException(401, { message: '無効なトークンが指定されました' })
  }

  await next()
})
