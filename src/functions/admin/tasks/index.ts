import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@functions/cors'
import { createAdminApp } from '@functions/admin-app'
import { AdminTasksLambdaHandlerDefinition } from '@functions/admin/tasks/lambda-handler'
import { handle } from 'hono/aws-lambda'

export const rules: AWS['functions'] = {
  deleteTaskAdminHandler: {
    handler: `${handlerPath(__dirname)}/handlers/delete-task-admin-handler.deleteTaskAdminHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'delete',
          path: 'admin/tasks/{id}',
          cors: corsSettings,
          request: {
            parameters: {
              paths: {
                id: true,
              },
            },
          },
        },
      },
    ],
  },
}

export default rules

const adminApp = createAdminApp()

export const adminTasksLambdaHandlerDefinition = new AdminTasksLambdaHandlerDefinition()

export const adminTasksApp = adminTasksLambdaHandlerDefinition.buildOpenApiRoute(adminApp)

export const handler = handle(adminTasksApp)
