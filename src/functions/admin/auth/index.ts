import { adminApp } from '@functions/admin-app'
import { AdminAuthLambdaHandlerDefinition } from '@functions/admin/auth/lambda-handler'
import { handle } from 'hono/aws-lambda'

export const adminLoginLambdaHandlerDefinition = new AdminAuthLambdaHandlerDefinition()

export const handler = handle(adminLoginLambdaHandlerDefinition.buildOpenApiRoute(adminApp.openApiApp()))
