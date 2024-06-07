import { fetchUser } from '@/domain/users/api/fetch-user'
import { updateUser } from '@/domain/users/api/update-user'
import { updateUserSchema } from '@/domain/users/user'
import { canUpdate } from '@/domain/users/user-policy'
import { type AppContext } from '@functions/app'
import { ROUTES } from '@functions/route-consts'
import { createRoute, type OpenAPIHono } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { HTTPException } from 'hono/http-exception'

export class UpdateUserAction extends ActionDefinition<AppContext> {
  buildOpenApiAppRoute(app: OpenAPIHono<AppContext>): void {
    const route = createRoute({
      tags: ['users'],
      method: 'put',
      path: ROUTES.USERS.UPDATE.DEFINITION,
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
      request: {
        body: {
          content: {
            'application/json': {
              schema: updateUserSchema,
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
      const userId = c.req.param('id')

      const targetUser = await fetchUser(userId)
      if (targetUser == null) {
        throw new HTTPException(404)
      }

      if (!canUpdate(c.var.user, targetUser)) {
        throw new HTTPException(403)
      }

      const newData = c.req.valid('json')

      await updateUser(userId, {
        name: newData.name,
        loginId: newData.loginId,
        email: newData.email,
      })

      c.status(204)
      return c.body(null)
    })
  }
}
