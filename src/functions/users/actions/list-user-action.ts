import { userDetailSchema } from '@/domain/users/user'
import { fetchUserList } from '@/domain/users/api/fetch-user-list'
import { ROUTES } from '@/functions/route-consts'
import { type OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { type AppContext } from '@functions/app'

const listUsersRequestSchema = z.object({
  loginId: z.string().optional(),
  page: z.number().optional(),
  offset: z.number().optional(),
})

const listUsersResponseSchema = z.object({
  data: z.array(
    userDetailSchema.extend({
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
    }),
  ),
  count: z.number(),
})

export class ListUsersAction extends ActionDefinition<AppContext> {
  buildOpenApiAppRoute(app: OpenAPIHono<AppContext>): void {
    const route = createRoute({
      tags: ['users'],
      method: 'get',
      path: ROUTES.USERS.LIST.DEFINITION,
      security: [
        {
          AppBearer: [],
        },
      ],
      request: {
        query: listUsersRequestSchema,
      },
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: listUsersResponseSchema,
            },
          },
        },
      },
    })

    app.openapi(route, async (c) => {
      const parsedQuery = c.req.valid('query')

      const { loginId /* page, offset */ } = parsedQuery

      const userListResponse = await fetchUserList(loginId)

      return c.json({
        data: userListResponse?.list ?? [],
        count: userListResponse?.count ?? 0,
      })
    })
  }
}
