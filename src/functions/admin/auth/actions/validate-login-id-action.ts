import { type AdminUser } from '@/domain/admin-users/admin-user'
import { fetchAdminUser } from '@/domain/admin-users/api/fetch-admin-user'
import { validateLoginId } from '@/domain/admin-users/api/validate-login-id'
import { type AdminAppContext } from '@functions/admin-app'
import { ROUTES } from '@functions/route-consts'
import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'

export const validateLoginIdRequestSchema = z.object({
  loginId: z.string(),
  except: z.string().optional(),
})

export class ValidateLoginIdAction extends ActionDefinition<AdminAppContext> {
  buildOpenApiAppRoute(app: OpenAPIHono<AdminAppContext>): void {
    const route = createRoute({
      method: 'get',
      path: ROUTES.ADMIN.AUTH.VALIDATE_LOGIN_ID.DEFINITION,
      request: {
        query: validateLoginIdRequestSchema,
      },
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: z.object({
                valid: z.boolean(),
              }),
            },
          },
        },
      },
    })

    app.openapi(route, async (c) => {
      const loginId = c.req.valid('query').loginId
      let exceptUser: AdminUser | undefined

      if (c.req.valid('query').except != null) {
        exceptUser = await fetchAdminUser(c.req.valid('query').except ?? '')
      }

      const isValid = await validateLoginId(loginId, exceptUser)
      return c.json({
        valid: isValid,
      })
    })
  }
}
