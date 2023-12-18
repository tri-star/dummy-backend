import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import users from '@functions/users';


const serverlessConfiguration: AWS = {
  service: 'dummy-backend',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-better-credentials', 'serverless-offline'],
  useDotenv: true,
  provider: {
    name: 'aws',
    region: '${env:AWS_REGION}' as any,
    runtime: 'nodejs20.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              'secretsmanager:GetSecretValue',
              'secretsmanager:DescribeSecret',
            ],
            Resource: 'arn:aws:secretsmanager:${env:AWS_REGION}:${env:AWS_ACCOUNT}:secret:/supabase/url',
          },
          {
            Effect: 'Allow',
            Action: [
              'secretsmanager:GetSecretValue',
              'secretsmanager:DescribeSecret',
            ],
            Resource: 'arn:aws:secretsmanager:${env:AWS_REGION}:${env:AWS_ACCOUNT}:secret:/supabase/anon_key',
          },
        ],
      },
    },
    memorySize: 128,
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SUPABASE_URL: '${env:SUPABASE_URL, ssm:/aws/reference/secretsmanager//supabase/url}',
      SUPABASE_ANON_KEY: '${env:SUPABASE_ANON_KEY, ssm:/aws/reference/secretsmanager//supabase/anon_key}',
    },
  },
  functions: { hello, users },
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
};

module.exports = serverlessConfiguration;
