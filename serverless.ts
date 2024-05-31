import type { AWS } from '@serverless/typescript'

import adminUserHandler from '@functions/admin/users'
import adminCompanyHandler from '@functions/admin/companies'
import adminTaskHandler from '@functions/admin/tasks'
import authHandler from '@functions/auth'
import userHandler from '@functions/users'
import { openApiFunctionRules } from '@functions/open-api-routes'

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
    },
  },
  functions: {
    ...openApiFunctionRules,
    ...adminUserHandler,
    ...adminCompanyHandler,
    ...adminTaskHandler,
    ...authHandler,
    ...userHandler,
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
