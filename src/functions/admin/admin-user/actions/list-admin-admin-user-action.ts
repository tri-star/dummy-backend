import { adminUserSchema } from '@/domain/admin-users/admin-user'
import { fetchAdminUserList } from '@/domain/admin-users/api/fetch-admin-user-list'
import { ROUTES } from '@/functions/route-consts'
import { type OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'

const listAdminUsersRequestSchema = z.object({
  loginId: z.string().optional(),
  page: z.number().optional(),
  offset: z.number().optional(),
})

const listAdminUsersResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(
    adminUserSchema.extend({
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
    }),
  ),
  count: z.number(),
})

export class ListAdminAdminUserAction extends ActionDefinition {
  actionDefinition(app: OpenAPIHono): void {
    const route = createRoute({
      method: 'get',
      path: ROUTES.ADMIN.ADMIN_USERS.LIST.DEFINITION,
      security: [
        {
          AdminBearer: [],
        },
      ],
      request: {
        query: listAdminUsersRequestSchema,
      },
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: listAdminUsersResponseSchema,
            },
          },
        },
      },
    })

    app.openapi(route, async (c) => {
      const { loginId /* page, offset */ } = c.req.valid('query')

      const userListResponse = await fetchAdminUserList(loginId)

      return c.json({
        success: true,
        data: userListResponse?.list ?? [],
        count: userListResponse?.count ?? 0,
      })
    })
  }
}
