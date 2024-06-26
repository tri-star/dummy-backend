import { corsSettings } from '@functions/cors'
import { CreateUserAdminAction } from '@functions/admin/users/actions/create-user-admin-action'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { handlerPath } from '@libs/handler-resolver'
import { LambdaHandlerDefinition } from '@libs/open-api/lambda-handler-definition'
import { type AWS } from '@serverless/typescript'
import { ListUserAdminAction } from '@functions/admin/users/actions/list-user-admin-action'
import { FetchUserAdminAction } from '@functions/admin/users/actions/fetch-user-admin-action'
import { UpdateUserAdminAction } from '@functions/admin/users/actions/update-user-admin-action'
import { DeleteUserAdminAction } from '@functions/admin/users/actions/delete-user-admin-action'
import { type AdminAppContext } from '@functions/admin-app'

export class UserAdminLambdaHandlerDefinition extends LambdaHandlerDefinition<AdminAppContext> {
  definition(): AWS['functions'] {
    return {
      userAdminHandler: {
        handler: `${handlerPath(__dirname)}/index.handler`,
        timeout: 15,
        events: [
          {
            http: {
              method: 'ANY',
              path: 'admin/users/{proxy+}',
              cors: corsSettings,
            },
          },
          {
            http: {
              method: 'ANY',
              path: 'admin/users',
              cors: corsSettings,
            },
          },
        ],
      },
    }
  }

  buildOpenApiRoute(app: OpenAPIHono<AdminAppContext>): OpenAPIHono<AdminAppContext> {
    new CreateUserAdminAction().buildOpenApiAppRoute(app)
    new ListUserAdminAction().buildOpenApiAppRoute(app)
    new FetchUserAdminAction().buildOpenApiAppRoute(app)
    new UpdateUserAdminAction().buildOpenApiAppRoute(app)
    new DeleteUserAdminAction().buildOpenApiAppRoute(app)
    return app
  }
}
