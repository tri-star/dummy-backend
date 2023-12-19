import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway'
import { formatJSONResponse } from '@libs/api-gateway'
import { middyfy } from '@libs/lambda'
import { fetchUsers } from 'src/domain/users/api/user-api'

// import schema from './schema';

type Schema = Record<string, unknown>

const hello: ValidatedEventAPIGatewayProxyEvent<Schema> = async (_) => {
  const users = await fetchUsers()
  return formatJSONResponse({
    data: users.data,
    count: users.count,
  })
}

export const main = middyfy(hello)
