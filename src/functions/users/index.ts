import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
// import { updateUserSchema } from './schema'
import { corsSettings } from '@functions/cors'
import { UserLambdaHandlerDefinition } from '@functions/users/handler'
import { createApp } from '@functions/app'
import { handle } from 'hono/aws-lambda'

export const rules: AWS['functions'] = {
  listUsersHandler: {
    handler: `${handlerPath(__dirname)}/handlers/list-users-handler.listUsersHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'get',
          path: 'users',
          // request: {
          //   parameters: {
          //     querystrings: {
          //       loginId: true,
          //     },
          //   },
          // },
          cors: corsSettings,
        },
      },
    ],
  },
  fetchUserHandler: {
    handler: `${handlerPath(__dirname)}/handlers/fetch-user-handler.fetchUserHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'get',
          path: 'users/{id}',
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
  updateUserHandler: {
    handler: `${handlerPath(__dirname)}/handlers/update-user-handler.updateUserHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'put',
          path: 'users/{id}',
          request: {
            parameters: {
              paths: {
                id: true,
              },
            },
            // schemas: {
            //   'application/json': {
            //     schema: updateUserSchema,
            //   },
            // },
          },
          cors: corsSettings,
        },
      },
    ],
  },
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

const app = createApp()

export const userLambdaHandlerDefinition = new UserLambdaHandlerDefinition()
userLambdaHandlerDefinition.buildOpenApiRoute(app)

export const handler = handle(app)
