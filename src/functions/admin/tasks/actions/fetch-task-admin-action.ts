import { fetchTask } from '@/domain/tasks/api/fetch-task'
import { taskSchema } from '@/domain/tasks/task'
import { ROUTES } from '@functions/route-consts'
import { type OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { HTTPException } from 'hono/http-exception'

export class FetchTaskAdminAction extends ActionDefinition {
  buildOpenApiAppRoute(app: OpenAPIHono): void {
    const route = createRoute({
      tags: ['tasks'],
      method: 'get',
      path: ROUTES.ADMIN.TASKS.DETAIL.DEFINITION,
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
              schema: taskSchema.extend({
                createdAt: z.string().optional(),
                updatedAt: z.string().optional(),
              }),
            },
          },
        },
      },
    })

    app.openapi(route, async (c) => {
      const taskId = c.req.param('id')
      if (taskId == null) {
        throw new HTTPException(400)
      }

      const taskResponse = await fetchTask(taskId)

      if (taskResponse == null) {
        throw new HTTPException(404)
      }

      return c.json({
        ...taskResponse,
      })
    })
  }
}
