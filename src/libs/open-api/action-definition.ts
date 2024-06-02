import { type OpenAPIHono } from '@hono/zod-openapi'

export abstract class ActionDefinition {
  abstract buildOpenApiAppRoute(app: OpenAPIHono): void
}
