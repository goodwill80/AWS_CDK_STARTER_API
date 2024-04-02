import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getSpaces(
  event: APIGatewayProxyEvent,
  docClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // If there is queryStringParameters
  if (event.queryStringParameters) {
    if ("id" in event.queryStringParameters) {
      const spaceId = event.queryStringParameters["id"];
      // GET BY PARAM - GetITemCommand
      const getItemResponse = await docClient.send(
        new GetItemCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            id: {
              S: spaceId,
            },
          },
        })
      );
      if (getItemResponse.Item) {
        const unmarsalledITem = unmarshall(getItemResponse.Item);
        return {
          statusCode: 200,
          body: JSON.stringify(unmarsalledITem),
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify(`Space with id ${spaceId} cannot be found!`),
        };
      }
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify("ID required"),
      };
    }
  }
  // If there is no queryStringParameters then Get all spaces from Dynamo DB
  const result = await docClient.send(
    // GET ALL - ScanCommand
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );
  console.log(result.Items);
  const unmarshalledItems = result.Items?.map((item) => {
    return unmarshall(item);
  });
  return {
    statusCode: 201,
    body: JSON.stringify(unmarshalledItems),
  };
}
