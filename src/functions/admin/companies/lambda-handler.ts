import { corsSettings } from '@/functions/cors'
import { CreateCompanyAdminAction } from '@functions/admin/companies/actions/create-company-admin-action'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { handlerPath } from '@libs/handler-resolver'
import { LambdaHandlerDefinition } from '@libs/open-api/lambda-handler-definition'
import { type AWS } from '@serverless/typescript'

export class AdminCompanyLambdaHandlerDefinition extends LambdaHandlerDefinition {
  definition(): AWS['functions'] {
    return {
      AdminCompaniesHandler: {
        handler: `${handlerPath(__dirname)}/index.handler`,
        timeout: 15,
        events: [
          {
            http: {
              method: '*',
              path: '/admin/companies/{proxy+}',
              cors: corsSettings,
            },
          },
        ],
      },
    }
  }

  buildOpenApiRoute(parentApp: OpenAPIHono): OpenAPIHono {
    new CreateCompanyAdminAction().buildOpenApiAppRoute(parentApp)
    return parentApp
  }
}
