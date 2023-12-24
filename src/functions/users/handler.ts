import { formatJSONResponse, formatJSONUserErrorResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { type APIGatewayProxyEvent } from 'aws-lambda'
import { createUser, fetchUsers } from 'src/domain/users/api/user-api'
import { userSchema } from 'src/domain/users/user'

export const listUsersHandler = middyfy(async () => {
  const users = await fetchUsers()
  return formatJSONResponse({
    data: users.data,
    count: users.count,
  })
})

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
