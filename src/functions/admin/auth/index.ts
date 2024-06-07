import { createAdminApp } from '@functions/admin-app'
import { AdminAuthLambdaHandlerDefinition } from '@functions/admin/auth/lambda-handler'
import { handle } from 'hono/aws-lambda'

const adminApp = createAdminApp()

export const adminLoginLambdaHandlerDefinition = new AdminAuthLambdaHandlerDefinition()

export const adminLoginApp = adminLoginLambdaHandlerDefinition.buildOpenApiRoute(adminApp)

export const handler = handle(adminLoginApp)
