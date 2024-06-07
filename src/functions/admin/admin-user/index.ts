import { AdminAdminUserLambdaHandlerDefinition } from '@/functions/admin/admin-user/lambda-handler'
import { createAdminApp } from '@functions/admin-app'
import { handle } from 'hono/aws-lambda'

const adminApp = createAdminApp()

export const adminAdminUserLambdaHandlerDefinition = new AdminAdminUserLambdaHandlerDefinition()

export const adminAdminUserApp = adminAdminUserLambdaHandlerDefinition.buildOpenApiRoute(adminApp)

export const handler = handle(adminAdminUserApp)
