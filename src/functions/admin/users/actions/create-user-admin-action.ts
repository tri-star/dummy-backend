import { createUser } from '@/domain/users/api/create-user'
import { createPasswordHash, createUserSchema, userSchema } from '@/domain/users/user'
import { ROUTES } from '@functions/route-consts'
import { createRoute, z, type OpenAPIHono } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { ulid } from 'ulid'

export class CreateUserAdminAction extends ActionDefinition {
  buildOpenApiAppRoute(parentApp: OpenAPIHono): void {
    const route = createRoute({
      tags: ['users'],
      method: 'post',
      path: ROUTES.ADMIN.USERS.CREATE.DEFINITION,
      security: [{ AdminBearer: [] }],
      request: {
        body: {
          content: {
            'application/json': {
              schema: createUserSchema,
            },
          },
        },
      },
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

    parentApp.openapi(route, async (c) => {
      const data = c.req.valid('json')

      const userId = ulid()
      const hashedPassword = createPasswordHash(data.password, userId)
      const createdUser = await createUser(userId, {
        ...data,
        password: hashedPassword,
      })

      return c.json(createdUser)
    })
  }
}
