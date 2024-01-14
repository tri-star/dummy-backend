import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { createUserSchema, updateUserSchema } from './schema'
import { corsSettings } from '@functions/cors'

export const rules: AWS['functions'] = {
  listUsersHandler: {
    handler: `${handlerPath(__dirname)}/handler.listUsersHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: 'users',
          cors: corsSettings,
        },
      },
    ],
  },
  createUserHandler: {
    handler: `${handlerPath(__dirname)}/handler.createUserHandler`,
    events: [
      {
        http: {
          method: 'post',
          path: 'user',
          request: {
            schemas: {
              'application/json': {
                schema: createUserSchema,
              },
            },
          },
          cors: corsSettings,
        },
      },
    ],
  },
  updateUserHandler: {
    handler: `${handlerPath(__dirname)}/handler.updateUserHandler`,
    events: [
      {
        http: {
          method: 'patch',
          path: 'user/{id}',
          request: {
            parameters: {
              paths: {
                id: true,
              },
            },
            schemas: {
              'application/json': {
                schema: updateUserSchema,
              },
            },
          },
          cors: corsSettings,
        },
      },
    ],
  },
  deleteUserHandler: {
    handler: `${handlerPath(__dirname)}/handler.deleteUserHandler`,
    events: [
      {
        http: {
          method: 'delete',
          path: 'user/{id}',
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
