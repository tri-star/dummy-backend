import { adminUserSchema, createAdminPasswordHash, createAdminUserSchema } from '@/domain/admin-users/admin-user'
import { createAdminUser } from '@/domain/admin-users/api/create-admin-user'
import { ROUTES } from '@/functions/route-consts'
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { ulid } from 'ulid'

export class CreateAdminAdminUserAction extends ActionDefinition {
  actionDefinition(): OpenAPIHono {
    const route = createRoute({
      method: 'post',
      path: ROUTES.ADMIN.ADMIN_USERS.CREATE.DEFINITION,
      request: {
        body: {
          content: {
            'application/json': {
              schema: createAdminUserSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: adminUserSchema.extend({
                createdAt: z.string().optional(),
                updatedAt: z.string().optional(),
              }),
            },
          },
        },
      },
    })

    const action = new OpenAPIHono()
    action.openapi(route, async (c) => {
      const user = c.req.valid('json')

      const userId = ulid()
      const hashedPassword = createAdminPasswordHash(user.password, userId)
      const createdUser = await createAdminUser(userId, {
        name: user.name,
        loginId: user.loginId,
        password: hashedPassword,
      })
      return c.json(createdUser)
    })

    return action
  }
}
