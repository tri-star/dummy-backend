import { handle } from 'hono/aws-lambda'
import { createAdminApp } from '@functions/admin-app'
import { UserAdminLambdaHandlerDefinition } from '@functions/admin/users/handler'

export const userAdminApp = createAdminApp()

export const userAdminLambdaHandlerDefinition = new UserAdminLambdaHandlerDefinition()
userAdminLambdaHandlerDefinition.buildOpenApiRoute(userAdminApp)

export const handler = handle(userAdminApp)
