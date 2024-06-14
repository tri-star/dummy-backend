import { type AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@/functions/cors'

import { LambdaHandlerDefinition } from '@libs/open-api/lambda-handler-definition'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { AdminLoginAction } from '@/functions/admin/auth/actions/login-action'
import { type AdminAppContext } from '@functions/admin-app'
import { ValidateLoginIdAction } from '@functions/admin/auth/actions/validate-login-id-action'

export class AdminAuthLambdaHandlerDefinition extends LambdaHandlerDefinition<AdminAppContext> {
  definition(): AWS['functions'] {
    return {
      adminLoginHandler: {
        handler: `${handlerPath(__dirname)}/index.handler`,
        timeout: 15,
        events: [
          {
            http: {
              method: 'ANY',
              path: 'admin/auth/{proxy+}',
              cors: corsSettings,
            },
          },
        ],
      },
    }
  }

  buildOpenApiRoute(parentApp: OpenAPIHono<AdminAppContext>): OpenAPIHono<AdminAppContext> {
    new AdminLoginAction().buildOpenApiAppRoute(parentApp)
    new ValidateLoginIdAction().buildOpenApiAppRoute(parentApp)
    return parentApp
  }
}
