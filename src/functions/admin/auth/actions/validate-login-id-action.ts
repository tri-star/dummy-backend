import { validateLoginId } from '@/domain/admin-users/api/validate-login-id'
import { type AdminAppContext } from '@functions/admin-app'
import { ROUTES } from '@functions/route-consts'
import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'

export const validateLoginIdRequestSchema = z.object({
  loginId: z.string(),
})

export class ValidateLoginIdAction extends ActionDefinition<AdminAppContext> {
  buildOpenApiAppRoute(app: OpenAPIHono<AdminAppContext>): void {
    const route = createRoute({
      tags: ['admin-users'],
      method: 'get',
      path: ROUTES.ADMIN.AUTH.VALIDATE_LOGIN_ID.DEFINITION,
      security: [
        {
          AdminBearer: [],
        },
      ],
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
      const self = c.var.adminUser

      const isValid = await validateLoginId(loginId, self)
      return c.json({
        valid: isValid,
      })
    })
  }
}
