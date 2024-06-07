import { type User } from '@/domain/users/user'
import { authenticateMiddleware } from '@/middlewares/authenticate-next-middleware'
import { OpenAPIHono } from '@hono/zod-openapi'

export type AppContext = {
  Variables: {
    user: User | undefined
  }
}

export function createApp(): OpenAPIHono<AppContext> {
  const app = new OpenAPIHono<AppContext>()
  app.openAPIRegistry.registerComponent('securitySchemes', 'AppBearer', {
    type: 'http',
    scheme: 'bearer',
  })

  app.use(authenticateMiddleware)
  return app
}
