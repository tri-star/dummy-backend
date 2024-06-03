import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@functions/cors'
import { createAdminApp } from '@functions/admin-app'
import { handle } from 'hono/aws-lambda'
import { AdminCompanyLambdaHandlerDefinition } from '@functions/admin/companies/lambda-handler'

export const rules: AWS['functions'] = {
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
