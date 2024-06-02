import { type AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@/functions/cors'

import { LambdaHandlerDefinition } from '@libs/open-api/lambda-handler-definition'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { AdminLoginAction } from '@/functions/admin/auth/actions/login-action'

export class AdminAuthLambdaHandlerDefinition extends LambdaHandlerDefinition {
  definition(): AWS['functions'] {
    return {
      adminLoginHandler: {
        handler: `${handlerPath(__dirname)}/index.handler`,
        timeout: 15,
        events: [
          {
            http: {
              method: 'post',
              path: 'admin/auth/{proxy+}',
              cors: corsSettings,
            },
          },
        ],
      },
    }
  }

  buildOpenApiRoute(parentApp: OpenAPIHono): OpenAPIHono {
    new AdminLoginAction().actionDefinition(parentApp)
    return parentApp
  }
}
