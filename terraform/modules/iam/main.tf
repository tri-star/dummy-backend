resource "aws_iam_openid_connect_provider" "github_actions" {
  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com"
  ]

  thumbprint_list = [
    "1234567890123456789012345678901234567890"
  ]
}

resource "aws_iam_role" "serverless_deploy_role" {
  name = "serverless-deploy-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = "sts:AssumeRoleWithWebIdentity"
        Principal = {
          Federated = "arn:aws:iam::${var.aws_id}:oidc-provider/token.actions.githubusercontent.com"
        }
        Condition = {
          StringLike = {
            "token.actions.githubusercontent.com:sub" = "repo:${var.owner}/${var.repo}:*"
          }
        }
      }
    ]
  })
}

resource "aws_iam_policy" "serverless_deploy_policy" {
  name        = "serverless-deploy-policy"
  description = "policy for serverless framework deployment"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "lambda:ListTags",
          "lambda:ListFunctions",
          "lambda:ListLayers",
          "lambda:ListLayerVersions",
          "lambda:ListAliases",
          "lambda:ListFunctionsByCodeSigningConfig",
          "lambda:ListProvisionedConcurrencyConfigs",
          "lambda:ListCodeSigningConfigs",
          "lambda:ListFunctionEventInvokeConfigs",
          "lambda:ListEventSourceMappings",
          "lambda:ListVersionsByFunction",
          "lambda:ListFunctionUrlConfigs",
        ],
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "lambda:CreateFunction",
          "lambda:TagResource",
          "lambda:DeleteProvisionedConcurrencyConfig",
          "lambda:GetFunctionConfiguration",
          "lambda:GetProvisionedConcurrencyConfig",
          "lambda:DeleteFunction",
          "lambda:GetAlias",
          "lambda:UpdateFunctionUrlConfig",
          "lambda:CreateFunctionUrlConfig",
          "lambda:UpdateFunctionEventInvokeConfig",
          "lambda:DeleteFunctionCodeSigningConfig",
          "lambda:InvokeFunctionUrl",
          "lambda:GetEventSourceMapping",
          "lambda:InvokeFunction",
          "lambda:GetFunctionUrlConfig",
          "lambda:GetFunctionCodeSigningConfig",
          "lambda:UpdateAlias",
          "lambda:UpdateFunctionCode",
          "lambda:PutRuntimeManagementConfig",
          "lambda:GetFunctionConcurrency",
          "lambda:PutProvisionedConcurrencyConfig",
          "lambda:PublishVersion",
          "lambda:DeleteEventSourceMapping",
          "lambda:CreateAlias",
          "lambda:GetLayerVersion",
          "lambda:PublishLayerVersion",
          "lambda:InvokeAsync",
          "lambda:GetAccountSettings",
          "lambda:CreateEventSourceMapping",
          "lambda:GetLayerVersionPolicy",
          "lambda:UntagResource",
          "lambda:PutFunctionConcurrency",
          "lambda:DeleteCodeSigningConfig",
          "lambda:GetRuntimeManagementConfig",
          "lambda:DeleteLayerVersion",
          "lambda:PutFunctionEventInvokeConfig",
          "lambda:DeleteFunctionEventInvokeConfig",
          "lambda:CreateCodeSigningConfig",
          "lambda:PutFunctionCodeSigningConfig",
          "lambda:UpdateEventSourceMapping",
          "lambda:UpdateFunctionCodeSigningConfig",
          "lambda:GetFunction",
          "lambda:UpdateFunctionConfiguration",
          "lambda:UpdateCodeSigningConfig",
          "lambda:GetFunctionEventInvokeConfig",
          "lambda:DeleteAlias",
          "lambda:DeleteFunctionConcurrency",
          "lambda:GetCodeSigningConfig",
          "lambda:DeleteFunctionUrlConfig",
          "lambda:GetPolicy"
        ],
        Resource = "arn:aws:lambda:*:*:function:dummy-backend-${var.stage}*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:ListBucket",
          "s3:ListTagsForResource",
        ],
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:CreateBucket",
          "s3:DeleteBucket",
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject",
          "s3:DeleteObjectTagging",
          "s3:PutObjectTagging",
          "s3:ReplicateTags",
          "s3:PutBucketTagging",
          "s3:PutObjectVersionTagging",
          "s3:TagResource",
          "s3:DeleteObjectVersionTagging",
          "s3:UntagResource",
          "s3:PutEncryptionConfiguration",
          "s3:PutBucketPolicy",
        ],
        Resource = "arn:aws:s3:::dummy-backend-${var.stage}*"
      },
      {
        Effect = "Allow"
        Action = [
          "iam:CreateRole",
          "iam:DeleteRole",
          "iam:PutRolePolicy",
          "iam:DeleteRolePolicy",
          "iam:PassRole",
          "iam:GetRole",
        ],
        Resource = [
          "arn:aws:iam::*:role/dummy-backend-${var.stage}*",
          "arn:aws:iam::*:role/serverlessApiGatewayCloudWatchRole"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "apigateway:*"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "cloudformation:*"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:*",
        ],
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "secretsmanager:DescribeSecret",
          "ssm:GetParameter"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "xray:PutTraceSegments",
          "xray:PutTelemetryRecords"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "serverless_deploy_role_policy_attachment" {
  role       = aws_iam_role.serverless_deploy_role.name
  policy_arn = aws_iam_policy.serverless_deploy_policy.arn
}
