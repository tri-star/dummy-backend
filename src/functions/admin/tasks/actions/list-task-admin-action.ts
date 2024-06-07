import { fetchTaskList } from '@/domain/tasks/api/fetch-task-list'
import { taskSchema } from '@/domain/tasks/task'
import { ROUTES } from '@functions/route-consts'
import { type OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { ActionDefinition } from '@libs/open-api/action-definition'
import { HTTPException } from 'hono/http-exception'

const listTasksRequestSchema = z.object({
  keyword: z.string().optional(),
  page: z.number().optional(),
  offset: z.number().optional(),
})

const listTasksResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(taskSchema),
  count: z.number(),
})
export type FetchTasksListResponse = z.infer<typeof listTasksResponseSchema>

export class ListTaskAdminAction extends ActionDefinition {
  buildOpenApiAppRoute(app: OpenAPIHono): void {
    const route = createRoute({
      tags: ['tasks'],
      method: 'get',
      path: ROUTES.ADMIN.TASKS.LIST.DEFINITION,
      security: [
        {
          AdminBearer: [],
        },
      ],
      request: {
        query: listTasksRequestSchema,
      },
      responses: {
        200: {
          description: 'A list of tasks',
          content: {
            'application/json': {
              schema: listTasksResponseSchema,
            },
          },
        },
        400: {
          description: 'Bad Request',
        },
      },
    })

    app.openapi(route, async (c) => {
      const parsed = listTasksRequestSchema.safeParse(c.req.valid('query'))
      if (!parsed.success) {
        throw new HTTPException(400, { message: 'Bad Request' })
      }
      const { keyword /* page, offset */ } = parsed.data

      const taskListResponse = await fetchTaskList(keyword)
      return c.json({
        success: true,
        data: taskListResponse?.data ?? [],
        count: taskListResponse?.count ?? 0,
      } satisfies FetchTasksListResponse)
    })
  }
}
