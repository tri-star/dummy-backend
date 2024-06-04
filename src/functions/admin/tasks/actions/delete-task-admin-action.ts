import { deleteTask } from '@/domain/tasks/api/delete-task'
import { ROUTES } from '@functions/route-consts'
import { type OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { HTTPException } from 'hono/http-exception'

export class DeleteTaskAdminAction extends ActionDefinition {
  buildOpenApiAppRoute(parentApp: OpenAPIHono): void {
    const route = createRoute({
      tags: ['tasks'],
      method: 'delete',
      path: ROUTES.ADMIN.TASKS.DELETE.DEFINITION,
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
      responses: {
        204: {
          description: '',
        },
      },
    })

    parentApp.openapi(route, async (c) => {
      const taskId = c.req.param('id')
      if (taskId == null) {
        throw new HTTPException(400, { message: 'idが指定されていません' })
      }

      await deleteTask(taskId)

      c.status(204)
      return c.body(null)
    })
  }
}
