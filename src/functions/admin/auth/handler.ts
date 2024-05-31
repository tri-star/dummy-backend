import { type AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@/functions/cors'

import { adminLoginAction } from './actions/login'
import { handle } from 'hono/aws-lambda'

export default {
  adminLoginHandler: {
    handler: `${handlerPath(__dirname)}/handler.adminLoginHandler`,
    timeout: 15,
    events: [
      {
        http: {
          method: 'post',
          path: 'admin/auth/{proxy+}',
          cors: corsSettings,
        },
      },
    ],
  },
} satisfies AWS['functions']

export { adminLoginAction }

export const adminLoginHandler = handle(adminLoginAction)
