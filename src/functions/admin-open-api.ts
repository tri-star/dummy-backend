import { createAdminApp } from '@functions/admin-app'
import { adminAdminUserApp } from '@functions/admin/admin-user'
import { adminLoginApp } from '@functions/admin/auth'
import { adminCompaniesApp } from '@functions/admin/companies'
import { adminTasksApp } from '@functions/admin/tasks'
import { userAdminApp } from '@functions/admin/users'
import { corsSettings } from '@functions/cors'
import { swaggerUI } from '@hono/swagger-ui'
import { handlerPath } from '@libs/handler-resolver'
import { type AWS } from '@serverless/typescript'
import { handle } from 'hono/aws-lambda'

export const adminOpenApiSwaggerLambdaDefinition: AWS['functions'] = {
  adminSwaggerJsonHandler: {
    handler: `${handlerPath(__dirname)}/admin-open-api.swaggerJsonHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: '/admin/swagger-docs',
          cors: corsSettings,
        },
      },
    ],
  },
  adminSwaggerUiHandler: {
    handler: `${handlerPath(__dirname)}/admin-open-api.swaggerUiHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: '/admin/docs',
          cors: corsSettings,
        },
      },
    ],
  },
}

const adminApp = createAdminApp()
const stage = process.env.STAGE || 'local'

// NOTE: 全てのOpenAPIのルート定義が済んだ状態を作るため、各機能のappを追加していく
adminApp.route('/', adminLoginApp)
adminApp.route('/', adminAdminUserApp)
adminApp.route('/', adminCompaniesApp)
adminApp.route('/', userAdminApp)
adminApp.route('/', adminTasksApp)
adminApp.doc('/admin/swagger-docs', {
  openapi: '3.0.0',
  servers: [
    {
      url: `/${stage}`,
      description: 'Local server',
    },
  ],
  info: {
    version: '1.0.0',
    title: 'Dummy Backend Admin API',
  },
})

adminApp.get('/admin/docs', swaggerUI({ url: `/${stage}/admin/swagger-docs` }))

export const swaggerJsonHandler = handle(adminApp)
export const swaggerUiHandler = handle(adminApp)
