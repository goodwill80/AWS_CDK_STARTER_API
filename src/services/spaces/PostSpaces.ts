import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { validateAsSpaceEntry } from "../shared/DataValidator";
import { createRandomID, parseJSON } from "../shared/Utils";

export async function postSpaces(
  event: APIGatewayProxyEvent,
  docClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // Generate random ID
  const randomID = createRandomID();

  // Body passed sent from client
  const item = parseJSON(event.body);
  item.id = randomID;

  // Validate the requestBody to confirm all required fields are present. To throw missing field error if not
  validateAsSpaceEntry(item);

  // Post item to DynamoDB via lambda handler
  const result = await docClient.send(
    // PutItemCommand - used for POST OR PUT
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      // marshall repackage json into dynamodb formmat
      Item: marshall(item),
    })
  );
  // console.log(result);
  return {
    statusCode: 201,
    body: JSON.stringify(result),
  };
}

// ALTERNATIVE
// const createItem: PutItemInput = {
//   TableName: tableName,
//   Item: model as PutItemInputAttributeMap,
//   ConditionExpression: "PK <> :pk1 AND SK <> :sk1",
//   ExpressionAttributeValues: {
//     ":pk1": model.GetPartitionKey,
//     ":sk1": model.GetSortKey,
//   },
// };

// await this.docClient.put(createItem).promise();
