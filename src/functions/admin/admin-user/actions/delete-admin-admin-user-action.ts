import { deleteAdminUser } from '@/domain/admin-users/api/delete-admin-user'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { type OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { ROUTES } from '@functions/route-consts'
import { HTTPException } from 'hono/http-exception'
import { type AdminAppContext } from '@functions/admin-app'

export class DeleteAdminAdminUserAction extends ActionDefinition<AdminAppContext> {
  buildOpenApiAppRoute(app: OpenAPIHono<AdminAppContext>): void {
    const route = createRoute({
      tags: ['admin-users'],
      method: 'delete',
      path: ROUTES.ADMIN.ADMIN_USERS.DELETE.DEFINITION,
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
        },
      ],
      responses: {
        204: {
          description: '',
        },
      },
    })

    app.openapi(route, async (c) => {
      const adminUserId = c.req.param('id')
      if (adminUserId == null) {
        throw new HTTPException(400, { message: 'idが指定されていません' })
      }

      await deleteAdminUser(adminUserId)
      c.status(204)
      return c.body(null)
    })
  }
}
