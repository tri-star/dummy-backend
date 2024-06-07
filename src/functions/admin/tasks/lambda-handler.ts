import { corsSettings } from '@/functions/cors'
import { CreateTaskAdminAction } from '@functions/admin/tasks/actions/create-task-admin-action'
import { DeleteTaskAdminAction } from '@functions/admin/tasks/actions/delete-task-admin-action'
import { FetchTaskAdminAction } from '@functions/admin/tasks/actions/fetch-task-admin-action'
import { ListTaskAdminAction } from '@functions/admin/tasks/actions/list-task-admin-action'
import { UpdateTaskAdminAction } from '@functions/admin/tasks/actions/update-task-admin-action'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { handlerPath } from '@libs/handler-resolver'
import { LambdaHandlerDefinition } from '@libs/open-api/lambda-handler-definition'
import { type AWS } from '@serverless/typescript'

export class AdminTasksLambdaHandlerDefinition extends LambdaHandlerDefinition {
  definition(): AWS['functions'] {
    return {
      AdminTasksHandler: {
        handler: `${handlerPath(__dirname)}/index.handler`,
        timeout: 15,
        events: [
          {
            http: {
              method: 'ANY',
              path: '/admin/tasks/{proxy+}',
              cors: corsSettings,
            },
          },
          {
            http: {
              method: 'ANY',
              path: '/admin/tasks',
              cors: corsSettings,
            },
          },
        ],
      },
    }
  }

  buildOpenApiRoute(parentApp: OpenAPIHono): OpenAPIHono {
    new CreateTaskAdminAction().buildOpenApiAppRoute(parentApp)
    new ListTaskAdminAction().buildOpenApiAppRoute(parentApp)
    new FetchTaskAdminAction().buildOpenApiAppRoute(parentApp)
    new UpdateTaskAdminAction().buildOpenApiAppRoute(parentApp)
    new DeleteTaskAdminAction().buildOpenApiAppRoute(parentApp)
    return parentApp
  }
}
