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
import { JsonError, MissingFieldError } from "../shared/DataValidator";
import { addCORsHeader } from "../shared/Utils";

const docClient = new DynamoDBClient({});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  // let message: string;
  let apiResponse: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, docClient);
        apiResponse = getResponse;
        break;
      case "POST":
        const postResponse = await postSpaces(event, docClient);
        apiResponse = postResponse;
        break;
      case "PUT":
        const putResponse = await updateSpace(event, docClient);
        apiResponse = putResponse;
      case "DELETE":
        const deleteResponse = await deleteSpace(event, docClient);
        apiResponse = deleteResponse;
      default:
        break;
    }
  } catch (error) {
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    }
    if (error instanceof JsonError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    }
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

  addCORsHeader(apiResponse);
  return apiResponse;
}

export { handler };
