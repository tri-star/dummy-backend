import { CreateAdminAdminUserAction } from '@/functions/admin/admin-user/actions/create-admin-admin-user-action'
import { ListAdminAdminUserAction } from '@/functions/admin/admin-user/actions/list-admin-admin-user-action'
import { corsSettings } from '@/functions/cors'
import { type AdminAppContext } from '@functions/admin-app'
import { DeleteAdminAdminUserAction } from '@functions/admin/admin-user/actions/delete-admin-admin-user-action'
import { FetchAdminAdminUserAction } from '@functions/admin/admin-user/actions/fetch-admin-admin-user-action'
import { FetchSelfAdminUserAction } from '@functions/admin/admin-user/actions/fetch-self-admin-action'
import { UpdateAdminAdminUserAction } from '@functions/admin/admin-user/actions/update-admin-admin-user-action'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { handlerPath } from '@libs/handler-resolver'
import { LambdaHandlerDefinition } from '@libs/open-api/lambda-handler-definition'
import { type AWS } from '@serverless/typescript'

export class AdminAdminUserLambdaHandlerDefinition extends LambdaHandlerDefinition<AdminAppContext> {
  definition(): AWS['functions'] {
    return {
      createAdminUserNoAuthHandler: {
        handler: `${handlerPath(__dirname)}/functions/create-admin-user-no-auth-handler.createAdminUserNoAuthHandler`,
        events: [
          {
            sns: 'createAdminUser${sls:stage}',
          },
        ],
      },
      adminadminUsersHandler: {
        handler: `${handlerPath(__dirname)}/index.handler`,
        timeout: 15,
        events: [
          {
            http: {
              method: 'ANY',
              path: '/admin/admin-users/{proxy+}',
              cors: corsSettings,
            },
          },
          {
            http: {
              method: 'ANY',
              path: '/admin/admin-users',
              cors: corsSettings,
            },
          },
        ],
      },
    }
  }

  buildOpenApiRoute(parentApp: OpenAPIHono<AdminAppContext>): OpenAPIHono<AdminAppContext> {
    new CreateAdminAdminUserAction().buildOpenApiAppRoute(parentApp)
    new ListAdminAdminUserAction().buildOpenApiAppRoute(parentApp)
    new FetchSelfAdminUserAction().buildOpenApiAppRoute(parentApp) // FetchAdminAdminUserAction よりも前に定義する
    new FetchAdminAdminUserAction().buildOpenApiAppRoute(parentApp)
    new UpdateAdminAdminUserAction().buildOpenApiAppRoute(parentApp)
    new DeleteAdminAdminUserAction().buildOpenApiAppRoute(parentApp)

    return parentApp
  }
}
