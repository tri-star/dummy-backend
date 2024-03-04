import type { AWS } from '@serverless/typescript'
import { handlerPath } from '@libs/handler-resolver'
import { corsSettings } from '@functions/cors'
import { loginSchema } from './schema'

export const rules: AWS['functions'] = {
  loginHandler: {
    handler: `${handlerPath(__dirname)}/handler.loginHandler`,
    events: [
      {
        http: {
          method: 'post',
          path: 'auth/login',
          request: {
            schemas: {
              'application/json': {
                schema: loginSchema,
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
