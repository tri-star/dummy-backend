import { fetchUser } from '@/domain/users/api/fetch-user'
import { userSchema } from '@/domain/users/user'
import { canFetch } from '@/domain/users/user-policy'
import { type AppContext } from '@functions/app'
import { ROUTES } from '@functions/route-consts'
import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { HTTPException } from 'hono/http-exception'

export class FetchUserAction extends ActionDefinition<AppContext> {
  buildOpenApiAppRoute(app: OpenAPIHono<AppContext>): void {
    const route = createRoute({
      method: 'get',
      tags: ['users'],
      path: ROUTES.USERS.DETAIL.DEFINITION,
      security: [{ AppBearer: [] }],
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
        },
      ],
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: userSchema.extend({
                createdAt: z.string().optional(),
                updatedAt: z.string().optional(),
              }),
            },
          },
        },
      },
    })

    app.openapi(route, async (c) => {
      const userId = c.req.param('id')

      const userResponse = await fetchUser(userId)
      if (userResponse == null) {
        throw new HTTPException(404)
      }

      if (!canFetch(c.var.user, userResponse)) {
        throw new HTTPException(403)
      }

      return c.json(userResponse)
    })
  }
}
