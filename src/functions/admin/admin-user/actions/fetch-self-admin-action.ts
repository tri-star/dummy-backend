import { adminUserDetailSchema } from '@/domain/admin-users/admin-user'
import { type AdminAppContext } from '@functions/admin-app'
import { ROUTES } from '@functions/route-consts'
import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { HTTPException } from 'hono/http-exception'

export class FetchSelfAdminUserAction extends ActionDefinition<AdminAppContext> {
  buildOpenApiAppRoute(app: OpenAPIHono<AdminAppContext>): void {
    const route = createRoute({
      tags: ['admin-users'],
      method: 'get',
      path: ROUTES.ADMIN.ADMIN_USERS.SELF.DEFINITION,
      security: [
        {
          AdminBearer: [],
        },
      ],
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: adminUserDetailSchema.extend({
                createdAt: z.string().optional(),
                updatedAt: z.string().optional(),
              }),
            },
          },
        },
      },
    })

    app.openapi(route, async (c) => {
      const adminUser = c.var.adminUser
      if (adminUser == null) {
        throw new HTTPException(403)
      }

      return c.json(adminUser)
    })
  }
}
