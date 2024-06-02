import { type OpenAPIHono } from '@hono/zod-openapi'

export abstract class ActionDefinition {
  abstract defineAction(): OpenAPIHono
}
