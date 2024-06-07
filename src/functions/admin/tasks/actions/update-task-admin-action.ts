import { updateTaskSchema } from '@/domain/tasks/task'
import { updateTask } from '@/domain/tasks/api/update-task'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { type OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { ROUTES } from '@functions/route-consts'
import { HTTPException } from 'hono/http-exception'

export class UpdateTaskAdminAction extends ActionDefinition {
  buildOpenApiAppRoute(app: OpenAPIHono): void {
    const route = createRoute({
      tags: ['tasks'],
      method: 'put',
      path: ROUTES.ADMIN.TASKS.UPDATE.DEFINITION,
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
              schema: updateTaskSchema,
            },
          },
        },
      },
      responses: {
        204: {
          description: '',
        },
        400: {
          description: 'Invalid request parameters',
        },
        500: {
          description: 'Internal server error',
        },
      },
    })

    app.openapi(route, async (c) => {
      const taskId = c.req.param('id')
      if (taskId == null) {
        throw new HTTPException(400, { message: 'idが指定されていません' })
      }

      const newData = c.req.valid('json')

      await updateTask(taskId, newData)

      c.status(204)
      return c.body(null)
    })
  }
}
