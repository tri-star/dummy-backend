import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@functions/cors'
import { updateCompanySchema } from '@functions/admin/companies/schema'
import { createAdminApp } from '@functions/admin-app'
import { handle } from 'hono/aws-lambda'
import { AdminCompanyLambdaHandlerDefinition } from '@functions/admin/companies/lambda-handler'

export const rules: AWS['functions'] = {
  fetchCompanyAdminHandler: {
    handler: `${handlerPath(__dirname)}/handlers/fetch-company-admin-handler.fetchCompanyAdminHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'get',
          path: 'admin/companies/{id}',
          cors: corsSettings,
          request: {
            parameters: {
              paths: {
                id: true,
              },
            },
          },
        },
      },
    ],
  },
  updateCompanyAdminHandler: {
    handler: `${handlerPath(__dirname)}/handlers/update-company-admin-handler.updateCompanyAdminHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'put',
          path: 'admin/companies/{id}',
          cors: corsSettings,
          request: {
            parameters: {
              paths: {
                id: true,
              },
            },
            schemas: {
              'application/json': {
                schema: updateCompanySchema,
              },
            },
          },
        },
      },
    ],
  },
  deleteCompanyAdminHandler: {
    handler: `${handlerPath(__dirname)}/handlers/delete-company-admin-handler.deleteCompanyAdminHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'delete',
          path: 'admin/companies/{id}',
          cors: corsSettings,
          request: {
            parameters: {
              paths: {
                id: true,
              },
            },
          },
        },
      },
    ],
  },
}

export default rules

const adminApp = createAdminApp()

export const adminCompaniesLambdaHandlerDefinition = new AdminCompanyLambdaHandlerDefinition()

export const adminCompaniesApp = adminCompaniesLambdaHandlerDefinition.buildOpenApiRoute(adminApp)

export const handler = handle(adminCompaniesApp)
