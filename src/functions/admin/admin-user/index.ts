import { AdminAdminUserLambdaHandlerDefinition } from '@/functions/admin/admin-user/lambda-handler'
import { adminApp } from '@functions/admin-app'
import { handle } from 'hono/aws-lambda'

export const adminAdminUserLambdaHandlerDefinition = new AdminAdminUserLambdaHandlerDefinition()

export const handler = handle(adminAdminUserLambdaHandlerDefinition.buildOpenApiRoute(adminApp.openApiApp()))
