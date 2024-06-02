import { CreateAdminAdminUserAction } from '@functions/admin/admin-user/actions/create-admin-admin-user-action'
import { corsSettings } from '@functions/cors'
import { OpenAPIHono } from '@hono/zod-openapi'
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

  buildOpenApiRoute(): OpenAPIHono {
    const app = new OpenAPIHono()
    app.route('/', new CreateAdminAdminUserAction().defineAction())

    return app
  }
}
