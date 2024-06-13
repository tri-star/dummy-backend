import { type AdminUser } from '@/domain/admin-users/admin-user'
import { adminAuthenticateMiddleware } from '@/middlewares/admin-authenticate-next-middleware'
import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'

export type AdminAppContext = {
  Variables: {
    adminUser: AdminUser | undefined
  }
}

export function createAdminApp(): OpenAPIHono<AdminAppContext> {
  const app = new OpenAPIHono<AdminAppContext>()
  app.openAPIRegistry.registerComponent('securitySchemes', 'AdminBearer', {
    type: 'http',
    scheme: 'bearer',
  })

  app.use(
    cors({
      origin: '*',
      allowHeaders: ['Authorization', 'Content-Type'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
  )

  app.use('/admin/*', adminAuthenticateMiddleware)
  return app
}
