import { adminAuthenticateMiddleware } from '@/middlewares/admin-authenticate-next-middleware'
import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'

export function createAdminApp(): OpenAPIHono {
  const app = new OpenAPIHono()
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
