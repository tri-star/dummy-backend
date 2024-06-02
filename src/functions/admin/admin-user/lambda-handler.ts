import { CreateAdminAdminUserAction } from '@/functions/admin/admin-user/actions/create-admin-admin-user-action'
import { ListAdminAdminUserAction } from '@/functions/admin/admin-user/actions/list-admin-admin-user-action'
import { corsSettings } from '@/functions/cors'
import { FetchAdminAdminUserAction } from '@functions/admin/admin-user/actions/fetch-admin-admin-user-action'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { handlerPath } from '@libs/handler-resolver'
import { LambdaHandlerDefinition } from '@libs/open-api/lambda-handler-definition'
import { type AWS } from '@serverless/typescript'

export class AdminAdminUserLambdaHandlerDefinition extends LambdaHandlerDefinition {
  definition(): AWS['functions'] {
    return {
      createAdminUserNoAuthHandler: {
        handler: `${handlerPath(__dirname)}/functions/create-admin-user-no-auth-handler.createAdminUserNoAuthHandler`,
        events: [
          {
            sns: 'createAdminUser',
          },
        ],
      },
      AdminAdminUsersHandler: {
        handler: `${handlerPath(__dirname)}/index.handler`,
        timeout: 15,
        events: [
          {
            http: {
              method: '*',
              path: '/admin/admin-users/{proxy+}',
              cors: corsSettings,
            },
          },
        ],
      },
    }
  }

  buildOpenApiRoute(parentApp: OpenAPIHono): OpenAPIHono {
    new CreateAdminAdminUserAction().actionDefinition(parentApp)
    new ListAdminAdminUserAction().actionDefinition(parentApp)
    new FetchAdminAdminUserAction().actionDefinition(parentApp)

    return parentApp
  }
}
