import { fetchUserByToken } from '@/domain/users/api/fetch-user-by-token'
import { type AppContext } from '@functions/app'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

export const authenticateMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const noAuthRoutes = [
    '/admin', //
    '/auth',
    '/docs',
    '/swagger-docs',
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
  const user = await fetchUserByToken(token)
  if (user == null) {
    throw new HTTPException(401, { message: '無効なトークンが指定されました' })
  }

  c.set('user', user)

  await next()
})
