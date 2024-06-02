import { type OpenAPIHono } from '@hono/zod-openapi'

export abstract class ActionDefinition {
  abstract actionDefinition(app: OpenAPIHono): void
}
