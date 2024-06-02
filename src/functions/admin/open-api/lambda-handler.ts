import { corsSettings } from '@functions/cors'
import { swaggerUI } from '@hono/swagger-ui'
import { type OpenAPIHono } from '@hono/zod-openapi'
import { handlerPath } from '@libs/handler-resolver'
import { LambdaHandlerDefinition } from '@libs/open-api/lambda-handler-definition'
import { type AWS } from '@serverless/typescript'

export class AdminOpenApiLambdaHandlerDefinition extends LambdaHandlerDefinition {
  definition(): AWS['functions'] {
    return {
      adminSwaggerJsonHandler: {
        handler: `${handlerPath(__dirname)}/../../admin-app-routes.swaggerJsonHandler`,
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
        handler: `${handlerPath(__dirname)}/../../admin-app-routes.swaggerUiHandler`,
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
  }

  buildOpenApiRoute(parentApp: OpenAPIHono): OpenAPIHono {
    parentApp.doc('/admin/swagger-docs', {
      openapi: '3.0.0',
      servers: [
        {
          url: '/local',
          description: 'Local server',
        },
      ],
      info: {
        version: '1.0.0',
        title: 'Dummy Backend Admin API',
      },
    })

    parentApp.get('/admin/docs', swaggerUI({ url: '/local/admin/swagger-docs' }))

    return parentApp
  }
}
