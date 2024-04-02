import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";

const docClient = new DynamoDBClient({});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  // let message: string;

  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, docClient);
        return getResponse;
        break;
      case "POST":
        const postResponse = await postSpaces(event, docClient);
        return postResponse;
        break;
      case "PUT":
        const putResponse = await updateSpace(event, docClient);
        return putResponse;
      case "DELETE":
        const deleteResponse = await deleteSpace(event, docClient);
        return deleteResponse;
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

  // const response: APIGatewayProxyResult = {
  //   statusCode: 200,
  //   body: JSON.stringify(message),
  // };

  // return response;
}

export { handler };
