import { adminApp } from '@functions/admin-app'
import { adminAdminUserLambdaHandlerDefinition } from '@functions/admin/admin-user'
import { adminLoginLambdaHandlerDefinition } from '@functions/admin/auth'
import { AdminOpenApiLambdaHandlerDefinition } from '@functions/admin/open-api/lambda-handler'
import { handle } from 'hono/aws-lambda'

const swaggerLambdaHandlerDefinition = new AdminOpenApiLambdaHandlerDefinition()

adminApp.addDefinition(adminLoginLambdaHandlerDefinition)
adminApp.addDefinition(adminAdminUserLambdaHandlerDefinition)
adminApp.addDefinition(swaggerLambdaHandlerDefinition)

// 全てのLambda関数定義をexport
export const adminAppLambdaHandlerDefinition = adminApp.lambdaDefinitions()

// NOTE: 全てのOpenAPIのルート定義が済んだ状態のadminAppを使う必要があるためここでexport
export const swaggerJsonHandler = handle(adminApp.openApiApp())
export const swaggerUiHandler = handle(adminApp.openApiApp())
