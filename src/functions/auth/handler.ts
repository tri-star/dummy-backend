import { type AppContext } from '@functions/app'
import { LoginAction } from '@functions/auth/actions/login-action'
import { corsSettings } from '@functions/cors'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { handlerPath } from '@libs/handler-resolver'
import { LambdaHandlerDefinition } from '@libs/open-api/lambda-handler-definition'
import { type AWS } from '@serverless/typescript'

export class AuthLambdaHandlerDefinition extends LambdaHandlerDefinition<AppContext> {
  definition(): AWS['functions'] {
    return {
      loginHandler: {
        handler: `${handlerPath(__dirname)}/index.handler`,
        timeout: 15,
        events: [
          {
            http: {
              method: 'post',
              path: 'auth/login',
              cors: corsSettings,
            },
          },
        ],
      },
    }
  }

  buildOpenApiRoute(app: OpenAPIHono<AppContext>): OpenAPIHono<AppContext> {
    new LoginAction().buildOpenApiAppRoute(app)
    return app
  }
}
