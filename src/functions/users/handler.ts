import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { createUser, deleteUser, fetchUsers, updateUser } from 'src/domain/users/api/user-api'
import { createPasswordHash, createUserSchema, updateUserSchema } from 'src/domain/users/user'
import { ulid } from 'ulid'

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
  const parseResult = createUserSchema.safeParse(event.body)
  if (!parseResult.success) {
    console.error('createUserHandler error', parseResult.error.errors)
    formatJSONUserErrorResponse({ errors: parseResult.error.errors })
    return
  }

  const user = parseResult.data

  const userId = ulid()
  const hashedPassword = createPasswordHash(user.password, userId)
  const createdUser = await createUser(userId, {
    name: user.name,
    email: user.email,
    companyId: user.companyId,
    password: hashedPassword,
  })

  return formatJSONResponse({ data: createdUser })
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
    companyId: user.companyId,
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
