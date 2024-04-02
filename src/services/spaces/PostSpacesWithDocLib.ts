import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { parseJSON } from "../shared/Utils";

export async function postSpacesWithDoc(
  event: APIGatewayProxyEvent,
  docClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // To repackage JSON object into Dynamo Object
  const ddDocClient = DynamoDBDocumentClient.from(docClient);
  // Get random ID
  const randomID = v4();
  // Body passed sent from client
  const item = parseJSON(event.body);
  item.id = randomID;
  // Post item to DynamoDB via lambda handler
  const result = await ddDocClient.send(
    // PutItemCommand - used for POST OR PUT
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      // The DynamoDBDocumentClient would help to repackage the object from JSON to suit Dynamo DB
      Item: item,
    })
  );
  console.log(result);
  return {
    statusCode: 201,
    body: JSON.stringify(result),
  };
}
