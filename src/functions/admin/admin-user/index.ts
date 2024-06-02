import { AdminAdminUserLambdaHandlerDefinition } from '@/functions/admin/admin-user/handler'
import { handle } from 'hono/aws-lambda'

const adminAdminUserLambdaHandlerDefinition = new AdminAdminUserLambdaHandlerDefinition()

export const handler = handle(adminAdminUserLambdaHandlerDefinition.buildOpenApiRoute())
