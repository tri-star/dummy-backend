// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver'
import { createUserSchema } from './schema'

export default {
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
        },
      },
    ],
    request: {
      schemas: {
        'application/json': {
          schema: createUserSchema,
        },
      },
    },
  },
}
