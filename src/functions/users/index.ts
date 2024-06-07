import { UserLambdaHandlerDefinition } from '@functions/users/handler'
import { createApp } from '@functions/app'
import { handle } from 'hono/aws-lambda'

export const userApp = createApp()

export const userLambdaHandlerDefinition = new UserLambdaHandlerDefinition()
userLambdaHandlerDefinition.buildOpenApiRoute(userApp)

export const handler = handle(userApp)
