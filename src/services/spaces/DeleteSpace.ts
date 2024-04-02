import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
// import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function deleteSpace(
  event: APIGatewayProxyEvent,
  docClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // If there is queryStringParameters and a request body
  if (event.queryStringParameters && "id" in event.queryStringParameters) {
    const spaceId = event.queryStringParameters["id"];

    await docClient.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: spaceId },
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(`Deleted space with ID: ${spaceId}`),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify("Please provide right args!!"),
  };
}

// ALTERNATIVE METHOD - using docClient.put(item: PutItemInput).promised()
// if (errorOrHasCompleted.result) {
//           // use put item, to replace existing item
//           const replaceItem: PutItemInput = {
//             TableName: tableName,
//             Item: model as PutItemInputAttributeMap,
//             ConditionExpression:
//               "PK = :pk1 AND SK = :sk1 AND docVersion = :lastVersion",
//             ExpressionAttributeValues: {
//               ":pk1": model.GetPartitionKey,
//               ":sk1": model.GetSortKey,
//               ":lastVersion": model.GetDocVersion - 1,
//             },
//             ReturnValues: "ALL_OLD",
//           };

//           try {
//             // replace item by PK and SK
//             await this.docClient.put(replaceItem).promise();
//           } catch (error) {
//             return new customError(
//               RetryAction.NO_RETRY,
//               ErrorTypeEnums.ExternalLibraryError.AWS_PUTITEM_ERROR,
//               "Update aborted. AWS DynamoDb Error",
//               error as AWSError,
//               replaceItem
//             );
//           }
