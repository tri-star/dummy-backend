import { adminAuthenticateMiddleware } from '@/middlewares/admin-authenticate-next-middleware'
import { OpenAPIHono } from '@hono/zod-openapi'

export function createAdminApp(): OpenAPIHono {
  const app = new OpenAPIHono()
  app.openAPIRegistry.registerComponent('securitySchemes', 'AdminBearer', {
    type: 'http',
    scheme: 'bearer',
  })

  app.use('/admin/*', adminAuthenticateMiddleware)
  return app
}
