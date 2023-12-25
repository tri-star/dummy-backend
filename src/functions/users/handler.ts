import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { createUser, deleteUser, fetchUsers, updateUser } from 'src/domain/users/api/user-api'
import { updateUserSchema, userSchema } from 'src/domain/users/user'

/**
 * 一覧
 */
export const listUsersHandler = middyfy(async () => {
  try {
    const users = await fetchUsers()
    return formatJSONResponse({
      data: users.data,
      count: users.count,
    })
  } catch (e) {
    return formatJSONUserErrorResponse({ error: e })
  }
})

/**
 * 登録
 */
export const createUserHandler = middyfy(async (event: APIGatewayProxyEvent) => {
  const parseResult = userSchema.safeParse(event.body)
  if (!parseResult.success) {
    console.error('createUserHandler error', parseResult.error.errors)
    formatJSONUserErrorResponse({ errors: parseResult.error.errors })
    return
  }

  const user = parseResult.data

  await createUser({
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return formatJSONResponse({})
})

/**
 * 更新
 */
export const updateUserHandler = middyfy(async (event: APIGatewayProxyEvent) => {
  const userId = event.pathParameters?.id
  if (userId == null) {
    return formatJSONUserErrorResponse({ error: new Error('userId is required') })
  }

  const parseResult = updateUserSchema.safeParse(event.body)
  if (!parseResult.success) {
    console.error('updateUserHandler error', parseResult.error.errors)
    formatJSONUserErrorResponse({ errors: parseResult.error.errors })
    return
  }

  const user = parseResult.data

  await updateUser(userId, {
    name: user.name,
    email: user.email,
  })

  return formatJSONResponse({})
})

/**
 * 削除
 */
export const deleteUserHandler = middyfy(async (event: APIGatewayProxyEvent) => {
  const userId = event.pathParameters?.id
  if (userId == null) {
    return formatJSONUserErrorResponse({ error: new Error('userId is required') })
  }

  await deleteUser(userId)

  return formatJSONResponse({})
})
