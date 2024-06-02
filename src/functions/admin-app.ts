import { adminAuthenticateMiddleware } from '@/middlewares/admin-authenticate-next-middleware'
import { OpenAPIHono } from '@hono/zod-openapi'
import { AppDefinition } from '@libs/open-api/app-definition'

// Lambdaの有効なエンドポイント一覧

export class AdminAppDefinition extends AppDefinition {
  createApp(): OpenAPIHono {
    const app = new OpenAPIHono()
    app.openAPIRegistry.registerComponent('securitySchemes', 'AdminBearer', {
      type: 'http',
      scheme: 'bearer',
    })

    app.use('/admin/*', adminAuthenticateMiddleware)
    return app
  }
}

export const adminApp = new AdminAppDefinition()
