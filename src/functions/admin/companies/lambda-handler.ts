import { corsSettings } from '@/functions/cors'
import { type AdminAppContext } from '@functions/admin-app'
import { CreateCompanyAdminAction } from '@functions/admin/companies/actions/create-company-admin-action'
import { DeleteCompanyAdminAction } from '@functions/admin/companies/actions/delete-company-admin-action'
import { FetchCompanyAdminAction } from '@functions/admin/companies/actions/fetch-company-admin-action'
import { ListCompanyAdminAction } from '@functions/admin/companies/actions/list-company-admin-action'
import { UpdateCompanyAdminAction } from '@functions/admin/companies/actions/update-company-admin-action'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { handlerPath } from '@libs/handler-resolver'
import { LambdaHandlerDefinition } from '@libs/open-api/lambda-handler-definition'
import { type AWS } from '@serverless/typescript'

export class AdminCompanyLambdaHandlerDefinition extends LambdaHandlerDefinition<AdminAppContext> {
  definition(): AWS['functions'] {
    return {
      AdminCompaniesHandler: {
        handler: `${handlerPath(__dirname)}/index.handler`,
        timeout: 15,
        events: [
          {
            http: {
              method: 'ANY',
              path: '/admin/companies/{proxy+}',
              cors: corsSettings,
            },
          },
          {
            http: {
              method: 'ANY',
              path: '/admin/companies',
              cors: corsSettings,
            },
          },
        ],
      },
    }
  }

  buildOpenApiRoute(parentApp: OpenAPIHono<AdminAppContext>): OpenAPIHono<AdminAppContext> {
    new CreateCompanyAdminAction().buildOpenApiAppRoute(parentApp)
    new ListCompanyAdminAction().buildOpenApiAppRoute(parentApp)
    new FetchCompanyAdminAction().buildOpenApiAppRoute(parentApp)
    new UpdateCompanyAdminAction().buildOpenApiAppRoute(parentApp)
    new DeleteCompanyAdminAction().buildOpenApiAppRoute(parentApp)
    return parentApp
  }
}
