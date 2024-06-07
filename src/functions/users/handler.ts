import { type AppContext } from '@functions/app'
import { corsSettings } from '@functions/cors'
import { FetchUserAction } from '@functions/users/actions/fetch-user-action'
import { CreateUserAction } from '@functions/users/actions/create-user-action'
import { ListUsersAction } from '@functions/users/actions/list-user-action'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { handlerPath } from '@libs/handler-resolver'
import { LambdaHandlerDefinition } from '@libs/open-api/lambda-handler-definition'
import { type AWS } from '@serverless/typescript'
import { UpdateUserAction } from '@functions/users/actions/update-user-action'
import { DeleteUserAction } from '@functions/users/actions/delete-user-action'

export class UserLambdaHandlerDefinition extends LambdaHandlerDefinition<AppContext> {
  definition(): AWS['functions'] {
    return {
      userHandler: {
        handler: `${handlerPath(__dirname)}/index.handler`,
        timeout: 15,
        events: [
          {
            http: {
              method: 'ANY',
              path: 'users/{proxy+}',
              cors: corsSettings,
            },
          },
          {
            http: {
              method: 'ANY',
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
    new ListUsersAction().buildOpenApiAppRoute(app)
    new FetchUserAction().buildOpenApiAppRoute(app)
    new UpdateUserAction().buildOpenApiAppRoute(app)
    new DeleteUserAction().buildOpenApiAppRoute(app)
    return app
  }
}
