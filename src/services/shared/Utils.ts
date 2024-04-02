import { APIGatewayProxyEvent } from 'aws-lambda';
import { JsonError } from './DataValidator';
import { randomUUID } from 'crypto';

// We are doing this because JSON.parse() if fail will throw its own error, hence, we want to stop that and throw our own error instead
export function parseJSON(arg: string) {
  try {
    return JSON.parse(arg);
  } catch (error) {
    throw new JsonError(error.message);
  }
}

export function createRandomID() {
  return randomUUID();
}

export function hasAdminGroup(event: APIGatewayProxyEvent) {
  const groups = event.requestContext.authorizer?.claims['cognito:groups'];
  if (groups) {
    return (groups as string).includes('admin');
  }
  return false;
}
