import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
// import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { hasAdminGroup } from '../shared/Utils';

export async function deleteSpace(
  event: APIGatewayProxyEvent,
  docClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // Check if user belongs to admin group
  const isAuthorised = hasAdminGroup(event);
  if (!isAuthorised) {
    return {
      statusCode: 401,
      body: JSON.stringify('Not authorised'),
    };
  }

  // If there is queryStringParameters and a request body
  if (event.queryStringParameters && 'id' in event.queryStringParameters) {
    const spaceId = event.queryStringParameters['id'];

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
    body: JSON.stringify('Please provide right args!!'),
  };
}

// ALTERNATIVE METHOD - using docClient.delete(item: DeleteItemInput).promised()
// const deleteItem: DeleteItemInput = {
//         TableName: tableName,
//         Key: {
//           PK: model.GetPartitionKey,
//           SK: model.GetSortKey,
//         },
//       };
//
// await this.docClient.delete(deleteItem).promise();
