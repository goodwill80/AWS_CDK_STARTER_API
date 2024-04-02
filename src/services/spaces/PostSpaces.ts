import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

export async function postSpaces(
  event: APIGatewayProxyEvent,
  docClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  const randomID = v4();
  // Body passed sent from client
  const item = JSON.parse(event.body);
  item.id = randomID;
  // Post item to DynamoDB via lambda handler
  const result = await docClient.send(
    // PutItemCommand - used for POST OR PUT
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      // marshall repackage json into dynamodb formmat
      Item: marshall(item),
    })
  );
  console.log(result);
  return {
    statusCode: 201,
    body: JSON.stringify(result),
  };
}
