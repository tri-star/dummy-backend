import { type OpenAPIHono } from '@hono/zod-openapi'
import { type AWS } from '@serverless/typescript'
import { type Env } from 'hono'

export abstract class LambdaHandlerDefinition<T extends Env = Env> {
  abstract definition(): AWS['functions']

  abstract buildOpenApiRoute(app: OpenAPIHono<T>): OpenAPIHono<T>
}
