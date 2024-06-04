import { createAdminApp } from '@functions/admin-app'
import { AdminTasksLambdaHandlerDefinition } from '@functions/admin/tasks/lambda-handler'
import { handle } from 'hono/aws-lambda'

const adminApp = createAdminApp()

export const adminTasksLambdaHandlerDefinition = new AdminTasksLambdaHandlerDefinition()

export const adminTasksApp = adminTasksLambdaHandlerDefinition.buildOpenApiRoute(adminApp)

export const handler = handle(adminTasksApp)
