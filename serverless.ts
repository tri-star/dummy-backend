import type { AWS } from '@serverless/typescript'

import users from '@functions/users'

const serverlessConfiguration: AWS = {
  service: 'dummy-backend',
  frameworkVersion: '3',
  configValidationMode: 'error',
  plugins: ['serverless-esbuild', 'serverless-better-credentials', 'serverless-offline'],
  useDotenv: true,
  provider: {
    name: 'aws',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    region: '${env:AWS_REGION}' as any,
    runtime: 'nodejs20.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
        Resource: 'arn:aws:secretsmanager:${env:AWS_REGION}:${env:AWS_ACCOUNT}:secret:/supabase/url',
      },
      {
        Effect: 'Allow',
        Action: ['secretsmanager:GetSecretValue', 'secretsmanager:DescribeSecret'],
        Resource: 'arn:aws:secretsmanager:${env:AWS_REGION}:${env:AWS_ACCOUNT}:secret:/supabase/anon_key',
      },
    ],
    memorySize: 128,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SUPABASE_URL: '${env:SUPABASE_URL, ssm:/aws/reference/secretsmanager//supabase/url}',
      SUPABASE_ANON_KEY: '${env:SUPABASE_ANON_KEY, ssm:/aws/reference/secretsmanager//supabase/anon_key}',
    },
  },
  functions: { ...users },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node20',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
}

module.exports = serverlessConfiguration
