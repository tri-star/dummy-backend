import { fetchUserForAuth } from '@/domain/users/api/fetch-user-for-auth'
import { generateToken } from '@/domain/users/api/generate-token'
import { createPasswordHash } from '@/domain/users/user'
import { type AppContext } from '@functions/app'
import { ROUTES } from '@functions/route-consts'
import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { HTTPException } from 'hono/http-exception'

const loginSchema = z.object({
  loginId: z.string(),
  password: z.string(),
})

export class LoginAction extends ActionDefinition<AppContext> {
  buildOpenApiAppRoute(parentApp: OpenAPIHono<AppContext>): void {
    const route = createRoute({
      tags: ['auth'],
      method: 'post',
      path: ROUTES.AUTH.LOGIN.DEFINITION,
      request: {
        body: {
          content: {
            'application/json': {
              schema: loginSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: z.object({
                token: z.string(),
              }),
            },
          },
        },
      },
    })

    parentApp.openapi(route, async (c) => {
      const { loginId, password } = c.req.valid('json')

      const user = await fetchUserForAuth(loginId)
      if (user === undefined) {
        throw new HTTPException(401, { message: 'ログインに失敗しました' })
      }

      const hashedPassword = user.password
      if (hashedPassword !== createPasswordHash(password, user.id)) {
        throw new HTTPException(401, { message: 'ログインに失敗しました' })
      }

      const token = await generateToken(user.id)
      return c.json({ token })
    })
  }
}
