import { type OpenAPIHono } from '@hono/zod-openapi'
import { type AWS } from '@serverless/typescript'

export abstract class LambdaHandlerDefinition {
  abstract definition(): AWS['functions']

  abstract buildOpenApiRoute(): OpenAPIHono
}
