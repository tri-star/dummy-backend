import { createApp } from '@functions/app'
import { AuthLambdaHandlerDefinition } from '@functions/auth/handler'
import { handle } from 'hono/aws-lambda'

const app = createApp()

export const authLambdaHandlerDefinition = new AuthLambdaHandlerDefinition()

authLambdaHandlerDefinition.buildOpenApiRoute(app)

export const handler = handle(app)
