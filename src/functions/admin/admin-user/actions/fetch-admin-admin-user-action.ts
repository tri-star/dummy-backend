import { adminUserDetailSchema } from '@/domain/admin-users/admin-user'
import { fetchAdminUser } from '@/domain/admin-users/api/fetch-admin-user'
import { type AdminAppContext } from '@functions/admin-app'
import { ROUTES } from '@functions/route-consts'
import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { HTTPException } from 'hono/http-exception'

export class FetchAdminAdminUserAction extends ActionDefinition<AdminAppContext> {
  buildOpenApiAppRoute(app: OpenAPIHono<AdminAppContext>): void {
    const route = createRoute({
      tags: ['admin-users'],
      method: 'get',
      path: ROUTES.ADMIN.ADMIN_USERS.DETAIL.DEFINITION,
      security: [
        {
          AdminBearer: [],
        },
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: 'ULID',
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
      const adminUserId = c.req.param('id')
      if (adminUserId == null) {
        throw new HTTPException(400)
      }

      const userResponse = await fetchAdminUser(adminUserId)
      if (userResponse == null) {
        throw new HTTPException(404)
      }
      return c.json(userResponse)
    })
  }
}
