import { AdminAdminUserLambdaHandlerDefinition } from '@functions/admin/admin-user/handler'
import adminLoginRule, { adminLoginAction } from '@functions/admin/auth/handler'
import { corsSettings } from '@functions/cors'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { handlerPath } from '@libs/handler-resolver'
import { type AWS } from '@serverless/typescript'
import { handle } from 'hono/aws-lambda'

const adminAdminUserLambdaHandlerDefinition = new AdminAdminUserLambdaHandlerDefinition()
export const openApiFunctionRules: AWS['functions'] = {
  // 機能毎のルールを定義
  ...adminLoginRule,
  ...adminAdminUserLambdaHandlerDefinition.definition(),

  // 一番最後にOpenAPIDocumentのルールを定義
  swaggerSpec: {
    handler: `${handlerPath(__dirname)}/open-api-routes.swaggerSpecHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'get',
          path: 'swagger-docs',
          cors: corsSettings,
        },
      },
    ],
  },
  swaggerUi: {
    handler: `${handlerPath(__dirname)}/open-api-routes.swaggerUiHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'get',
          path: 'docs',
          cors: corsSettings,
        },
      },
    ],
  },
}

const app = new OpenAPIHono()

app.route('/', adminLoginAction)
app.route('/', adminAdminUserLambdaHandlerDefinition.buildOpenApiRoute())

app.doc('/swagger-docs', {
  openapi: '3.0.0',
  servers: [
    {
      url: '/local',
      description: 'Local server',
    },
  ],
  info: {
    version: '1.0.0',
    title: 'Dummy Backend API',
  },
})

app.get('/docs', swaggerUI({ url: '/local/swagger-docs' }))

export const swaggerSpecHandler = handle(app)
export const swaggerUiHandler = handle(app)
