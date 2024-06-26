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
