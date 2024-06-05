import { type AppContext } from '@functions/app'
import { corsSettings } from '@functions/cors'
import { CreateUserAction } from '@functions/users/actions/create-user-action'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { handlerPath } from '@libs/handler-resolver'
import { LambdaHandlerDefinition } from '@libs/open-api/lambda-handler-definition'
import { type AWS } from '@serverless/typescript'

export class UserLambdaHandlerDefinition extends LambdaHandlerDefinition<AppContext> {
  definition(): AWS['functions'] {
    return {
      createUserHandler: {
        handler: `${handlerPath(__dirname)}/handlers/index.handler`,
        timeout: 15,
        events: [
          {
            http: {
              method: 'post',
              path: 'users',
              cors: corsSettings,
            },
          },
        ],
      },
    }
  }

  buildOpenApiRoute(app: OpenAPIHono<AppContext>): OpenAPIHono<AppContext> {
    new CreateUserAction().buildOpenApiAppRoute(app)
    return app
  }
}
