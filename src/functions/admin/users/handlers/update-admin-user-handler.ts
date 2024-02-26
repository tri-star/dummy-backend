import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { updateAdminUserSchema } from '@/domain/admin-users/admin-user'
import { middyfyWithAdminAuth } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { updateAdminUser } from '@/domain/admin-users/api/update-admin-user'

/**
 * 編集
 */
export const updateAdminUserHandler = middyfyWithAdminAuth(async (event: APIGatewayProxyEvent) => {
  const adminUserId = event.pathParameters?.id
  const parseResult = updateAdminUserSchema.safeParse(event.body ?? '{}')
  if (adminUserId == null) {
    console.error('updateAdminUserHandler error', 'adminUserId is null')
    return formatJSONUserErrorResponse({ errors: ['adminUserId is null'] })
  }
  if (!parseResult.success) {
    console.error('updateAdminUserHandler error', parseResult.error.errors)
    return formatJSONUserErrorResponse({ errors: parseResult.error.errors })
  }

  const newData = parseResult.data

  try {
    await updateAdminUser(adminUserId, {
      name: newData.name,
      loginId: newData.loginId,
    })
    return formatJSONResponse({})
  } catch (e) {
    console.error('updateAdminUserHandler error', e)
    return formatJSONUserErrorResponse({ errors: ['ユーザー更新に失敗しました'] })
  }
})
