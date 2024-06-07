import { deleteUser } from '@/domain/users/api/delete-user'
import { fetchUser } from '@/domain/users/api/fetch-user'
import { canDelete } from '@/domain/users/user-policy'
import { type AppContext } from '@functions/app'
import { ROUTES } from '@functions/route-consts'
import { createRoute, type OpenAPIHono } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { HTTPException } from 'hono/http-exception'

export class DeleteUserAction extends ActionDefinition<AppContext> {
  buildOpenApiAppRoute(app: OpenAPIHono<AppContext>): void {
    const route = createRoute({
      tags: ['users'],
      method: 'delete',
      path: ROUTES.USERS.DELETE.DEFINITION,
      security: [
        {
          AppBearer: [],
        },
      ],
      parameters: [
        {
          in: 'path',
          name: 'id',
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
      const userId = c.req.param('id')

      const targetUser = await fetchUser(userId)
      if (targetUser == null) {
        throw new HTTPException(404)
      }

      if (!canDelete(c.var.user, targetUser)) {
        throw new HTTPException(403)
      }

      await deleteUser(userId)

      c.status(204)
      return c.body(null)
    })
  }
}
