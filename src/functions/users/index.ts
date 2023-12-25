import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { createUserSchema, updateUserSchema } from './schema'

export const rules: AWS['functions'] = {
  listUsersHandler: {
    handler: `${handlerPath(__dirname)}/handler.listUsersHandler`,
    events: [
      {
        http: {
          method: 'get',
          path: 'users',
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
        },
      },
    ],
  },
}

export default rules
