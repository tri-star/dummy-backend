import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@functions/cors'
import { UserLambdaHandlerDefinition } from '@functions/users/handler'
import { createApp } from '@functions/app'
import { handle } from 'hono/aws-lambda'

export const rules: AWS['functions'] = {
  deleteUserHandler: {
    handler: `${handlerPath(__dirname)}/handlers/delete-user-handler.deleteUserHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'delete',
          path: 'users/{id}',
          request: {
            parameters: {
              paths: {
                id: true,
              },
            },
          },
          cors: corsSettings,
        },
      },
    ],
  },
}

export default rules

export const userApp = createApp()

export const userLambdaHandlerDefinition = new UserLambdaHandlerDefinition()
userLambdaHandlerDefinition.buildOpenApiRoute(userApp)

export const handler = handle(userApp)
