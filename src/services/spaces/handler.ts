import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { postSpaces } from "./PostSpaces";

const docClient = new DynamoDBClient({});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let message: string;

  try {
    switch (event.httpMethod) {
      case "GET":
        message = "Hello from GET";
        break;
      case "POST":
        const response = postSpaces(event, docClient);
        return response;
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };

  return response;
}

export { handler };
