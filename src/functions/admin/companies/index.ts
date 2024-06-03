import { createAdminApp } from '@functions/admin-app'
import { handle } from 'hono/aws-lambda'
import { AdminCompanyLambdaHandlerDefinition } from '@functions/admin/companies/lambda-handler'

const adminApp = createAdminApp()

export const adminCompaniesLambdaHandlerDefinition = new AdminCompanyLambdaHandlerDefinition()

export const adminCompaniesApp = adminCompaniesLambdaHandlerDefinition.buildOpenApiRoute(adminApp)

export const handler = handle(adminCompaniesApp)
