import adminLoginRule, { adminLoginAction } from '@functions/admin/auth/handler'
import { corsSettings } from '@functions/cors'
import { OpenAPIHono } from '@hono/zod-openapi'
import { handlerPath } from '@libs/handler-resolver'
import { type AWS } from '@serverless/typescript'
import { handle } from 'hono/aws-lambda'

export const openApiFunctionRules: AWS['functions'] = {
  // 機能毎のルールを定義
  ...adminLoginRule,

  // 一番最後にOpenAPIDocumentのルールを定義
  openApiDoc: {
    handler: `${handlerPath(__dirname)}/open-api-routes.docHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'get',
          path: 'doc',
          cors: corsSettings,
        },
      },
    ],
  },
}

const app = new OpenAPIHono()

app.route('/', adminLoginAction)

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Dummy Backend API',
  },
})

export const docHandler = handle(app)
