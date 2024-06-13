import { updateAdminUserSchema } from '@/domain/admin-users/admin-user'
import { updateAdminUser } from '@/domain/admin-users/api/update-admin-user'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { type OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { ROUTES } from '@functions/route-consts'
import { HTTPException } from 'hono/http-exception'
import { type AdminAppContext } from '@functions/admin-app'

export class UpdateAdminAdminUserAction extends ActionDefinition<AdminAppContext> {
  buildOpenApiAppRoute(app: OpenAPIHono<AdminAppContext>): void {
    const route = createRoute({
      tags: ['admin-users'],
      method: 'put',
      path: ROUTES.ADMIN.ADMIN_USERS.UPDATE.DEFINITION,
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
      request: {
        body: {
          content: {
            'application/json': {
              schema: updateAdminUserSchema,
            },
          },
        },
      },
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

      const newData = c.req.valid('json')

      await updateAdminUser(adminUserId, {
        name: newData.name,
        loginId: newData.loginId,
      })

      c.status(204)
      return c.body(null)
    })
  }
}
