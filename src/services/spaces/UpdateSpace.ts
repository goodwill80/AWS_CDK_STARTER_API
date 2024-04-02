import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
// import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function updateSpace(
  event: APIGatewayProxyEvent,
  docClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // If there is queryStringParameters and a request body
  if (
    event.queryStringParameters &&
    "id" in event.queryStringParameters &&
    event.body
  ) {
    const parseBody = JSON.parse(event.body); // *** Important - need to parse request body before extract the values
    const spaceId = event.queryStringParameters["id"];
    const requestBodyKey = Object.keys(parseBody)[0];
    const requestBodyValue = parseBody[requestBodyKey];

    const updateResult = await docClient.send(
      new UpdateItemCommand({
        // a. Define table name
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: spaceId },
        },
        // b. Set the pattern of key and value
        UpdateExpression: "set #xxxkey = :value",
        // c. Here we specify that we want to replace the value of this key with the new value in requestBodyValue
        ExpressionAttributeValues: {
          ":value": {
            S: requestBodyValue,
          },
        },
        ExpressionAttributeNames: {
          "#xxxkey": requestBodyKey,
        },

        // d. specify the return values - UPDATED_NEW would provide us the values of what is being updated
        ReturnValues: "UPDATED_NEW",
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(updateResult.Attributes),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify("Please provide right args!!"),
  };
}
