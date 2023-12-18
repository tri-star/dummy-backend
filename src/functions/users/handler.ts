import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

// import schema from './schema';

type Schema = {}

const hello: ValidatedEventAPIGatewayProxyEvent<Schema> = async (event) => {
  return formatJSONResponse({
    url: process.env.SUPABASE_URL,
    event,
  });
};

export const main = middyfy(hello);
