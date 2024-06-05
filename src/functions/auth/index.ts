import { createApp } from '@functions/app'
import { AuthLambdaHandlerDefinition } from '@functions/auth/handler'
import { handle } from 'hono/aws-lambda'

export const loginApp = createApp()

export const authLambdaHandlerDefinition = new AuthLambdaHandlerDefinition()

authLambdaHandlerDefinition.buildOpenApiRoute(loginApp)

export const handler = handle(loginApp)
