import { createAdminPasswordHash } from '@/domain/admin-users/admin-user'
import { fetchAdminUserForAuth } from '@/domain/admin-users/api/fetch-admin-user-for-auth'
import { generateAdminToken } from '@/domain/admin-users/api/generate-admin-token'
import { ROUTES } from '@/functions/route-consts'
import { type AdminAppContext } from '@functions/admin-app'
import { type OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { HTTPException } from 'hono/http-exception'

const adminLoginSchema = z.object({
  loginId: z.string(),
  password: z.string(),
})

export class AdminLoginAction extends ActionDefinition<AdminAppContext> {
  buildOpenApiAppRoute(app: OpenAPIHono<AdminAppContext>): void {
    const route = createRoute({
      method: 'post',
      path: ROUTES.ADMIN.AUTH.LOGIN.DEFINITION,
      request: {
        body: {
          content: {
            'application/json': {
              schema: adminLoginSchema,
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

    app.openapi(route, async (c) => {
      const json = c.req.valid('json')
      const loginId = String(json.loginId)
      const password = String(json.password)

      if (loginId === '') {
        throw new HTTPException(400, { message: 'loginIdが入力されていません' })
      }
      if (password === '') {
        throw new HTTPException(400, { message: 'passwordが入力されていません' })
      }

      const user = await fetchAdminUserForAuth(loginId)
      if (user === undefined) {
        throw new HTTPException(401, { message: 'ログインに失敗しました' })
      }

      const hashedPassword = user.password
      if (hashedPassword !== createAdminPasswordHash(password, user.id)) {
        throw new HTTPException(401, { message: 'ログインに失敗しました' })
      }

      const token = await generateAdminToken(user.id)

      return c.json({
        token,
      })
    })
  }
}
