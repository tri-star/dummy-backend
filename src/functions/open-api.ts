import { adminLoginApp } from '@functions/admin/auth'
import { createApp } from '@functions/app'
import { corsSettings } from '@functions/cors'
import { swaggerUI } from '@hono/swagger-ui'
import { handlerPath } from '@libs/handler-resolver'
import { type AWS } from '@serverless/typescript'
import { handle } from 'hono/aws-lambda'

export const openApiSwaggerLambdaDefinition: AWS['functions'] = {
  swaggerJsonHandler: {
    handler: `${handlerPath(__dirname)}/open-api.swaggerJsonHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: '/swagger-docs',
          cors: corsSettings,
        },
      },
    ],
  },
  swaggerUiHandler: {
    handler: `${handlerPath(__dirname)}/open-api.swaggerUiHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: '/docs',
          cors: corsSettings,
        },
      },
    ],
  },
}

const app = createApp()

// NOTE: 全てのOpenAPIのルート定義が済んだ状態を作るため、各機能のappを追加していく
app.route('/', adminLoginApp)
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

export const swaggerJsonHandler = handle(app)
export const swaggerUiHandler = handle(app)
