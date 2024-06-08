import { type User } from '@/domain/users/user'
import { authenticateMiddleware } from '@/middlewares/authenticate-next-middleware'
import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'

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

  app.use(
    cors({
      origin: '*',
      allowHeaders: ['Authorization', 'Content-Type'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
  )

  app.use(authenticateMiddleware)
  return app
}
