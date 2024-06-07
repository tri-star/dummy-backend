import { ulid } from 'ulid'
import { createTaskAdminSchema } from '@/domain/tasks/task'
import { createTask } from '@/domain/tasks/api/create-task'
import { fetchUser } from '@/domain/users/api/fetch-user'
import { fetchCompany } from '@/domain/company/api/fetch-company'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { type OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ROUTES } from '@functions/route-consts'
import { HTTPException } from 'hono/http-exception'

export class CreateTaskAdminAction extends ActionDefinition {
  buildOpenApiAppRoute(app: OpenAPIHono): void {
    const route = createRoute({
      tags: ['tasks'],
      method: 'post',
      path: ROUTES.ADMIN.TASKS.CREATE.DEFINITION,
      security: [
        {
          AdminBearer: [],
        },
      ],
      request: {
        body: {
          content: {
            'application/json': {
              schema: createTaskAdminSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: '',
          content: {
            'application/json': {
              schema: createTaskAdminSchema.extend({
                taskId: z.string(),
                createdAt: z.string().optional(),
                updatedAt: z.string().optional(),
              }),
            },
          },
        },
        400: {
          description: 'Bad Request',
        },
      },
    })

    app.openapi(route, async (c) => {
      const task = c.req.valid('json')

      const company = await fetchCompany(task.companyId)
      if (company == null) {
        throw new HTTPException(404, { message: '会社が見つかりません' })
      }

      const user = await fetchUser(task.createdUserId)
      if (user == null) {
        throw new HTTPException(400)
      }

      const taskId = ulid()
      const createdTask = await createTask(taskId, task)
      return c.json({ ...createdTask, taskId })
    })
  }
}
