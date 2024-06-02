import { type OpenAPIHono } from '@hono/zod-openapi'
import { type LambdaHandlerDefinition } from '@libs/open-api/lambda-handler-definition'
import { type AWS } from '@serverless/typescript'

export abstract class AppDefinition {
  protected definitions: LambdaHandlerDefinition[] = []

  protected app: OpenAPIHono

  constructor() {
    this.app = this.createApp()
  }

  abstract createApp(): OpenAPIHono

  addDefinition(definition: LambdaHandlerDefinition) {
    this.definitions.push(definition)
    this.app.route('/', definition.buildOpenApiRoute(this.app))
  }

  lambdaDefinitions(): AWS['functions'] {
    return this.definitions.reduce<AWS['functions']>((acc, definition) => {
      return {
        ...acc,
        ...definition.definition(),
      }
    }, {})
  }

  openApiApp() {
    return this.app
  }

  openApiRoutes() {
    this.definitions.forEach((definition: LambdaHandlerDefinition) => {
      definition.buildOpenApiRoute(this.app)
    })
  }
}
