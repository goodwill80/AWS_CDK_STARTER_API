Notes:

{
"id": {
"S": "6770e619-a712-45b4-883b-bd88a6f4b04c"
},
"location": {
"S": "Paris"
}
}

Return response from dynamoDB tend to be the above. In order to normalise it to be JSON object, we need to use these libraries to repackage the object.

1. marshell, unmarshall from - @aws-sdk/util-dynamodb, \*\*\* unmarshall only handles single object, and not good in handling arrays, therefore, we need to map through the array and call the unmarshall() on each item

2. DynamoDBDocumentClient from - @aws-sdk/lib-dynamodb

AWS Congito - comprise of 2 core function

1. User Pools - store user data and perform basic athentication using JWT (2 ways of creating userpool - in aws console or using cdk)
2. Identity Pools - Fined grained identity control which allow a user to assume an identity. It also can be directly called via AWS SDK commands
