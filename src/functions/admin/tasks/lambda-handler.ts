import { corsSettings } from '@/functions/cors'
import { CreateTaskAdminAction } from '@functions/admin/tasks/actions/create-task-admin-action'
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
              method: '*',
              path: '/admin/tasks/{proxy+}',
              cors: corsSettings,
            },
          },
        ],
      },
    }
  }

  buildOpenApiRoute(parentApp: OpenAPIHono): OpenAPIHono {
    new CreateTaskAdminAction().buildOpenApiAppRoute(parentApp)
    return parentApp
  }
}