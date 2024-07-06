import type { AWS } from '@serverless/typescript'

import { adminCompaniesLambdaHandlerDefinition } from '@functions/admin/companies'
import { adminTasksLambdaHandlerDefinition } from '@functions/admin/tasks'
import { authLambdaHandlerDefinition } from '@functions/auth'
// import { userLambdaHandlerDefinition } from '@functions/users'
import { adminAdminUserLambdaHandlerDefinition } from '@functions/admin/admin-user'
import { adminOpenApiSwaggerLambdaDefinition } from '@functions/admin-open-api'
import { adminLoginLambdaHandlerDefinition } from '@functions/admin/auth'
import { openApiSwaggerLambdaDefinition } from '@functions/open-api'
import { userAdminLambdaHandlerDefinition } from '@functions/admin/users'

const serverlessConfiguration: AWS = {
  service: 'dummy-backend',
  frameworkVersion: '3',
  configValidationMode: 'error',
  plugins: ['serverless-esbuild', 'serverless-better-credentials', 'serverless-offline'],
  useDotenv: true,
  provider: {
    name: 'aws',
    region: '${env:AWS_REGION}' as AWS['provider']['region'],
    tracing: {
      apiGateway: true,
      lambda: true,
    },
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
        Resource: 'arn:aws:secretsmanager:${env:AWS_REGION}:${env:AWS_ACCOUNT}:secret:${sls:stage}/supabase/url',
      },
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
        Resource:
          'arn:aws:secretsmanager:${env:AWS_REGION}:${env:AWS_ACCOUNT}:secret:${sls:stage}/supabase/service_role_key',
      },
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
        Resource: 'arn:aws:secretsmanager:${env:AWS_REGION}:${env:AWS_ACCOUNT}:secret:${sls:stage}/app/key',
      },
      {
        Effect: 'Allow',
        Action: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
        Resource: '*',
      },
    ],
    memorySize: 512,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SUPABASE_URL: '${env:SUPABASE_URL, ssm:/aws/reference/secretsmanager/${sls:stage}/supabase/url}',
      SUPABASE_SERVICE_ROLE_KEY:
        '${env:SUPABASE_SERVICE_ROLE_KEY, ssm:/aws/reference/secretsmanager/${sls:stage}/supabase/service_role_key}',
      APP_KEY: '${env:APP_KEY, ssm:/aws/reference/secretsmanager/${sls:stage}/app/key}',
      STAGE: '${sls:stage}',
    },
  },
  functions: {
    ...adminLoginLambdaHandlerDefinition.definition(),
    ...adminAdminUserLambdaHandlerDefinition.definition(),
    ...adminCompaniesLambdaHandlerDefinition.definition(),
    ...userAdminLambdaHandlerDefinition.definition(),
    ...adminTasksLambdaHandlerDefinition.definition(),
    ...authLambdaHandlerDefinition.definition(),
    // ...userLambdaHandlerDefinition.definition(),
    ...adminOpenApiSwaggerLambdaDefinition,
    ...openApiSwaggerLambdaDefinition,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
}

module.exports = serverlessConfiguration
