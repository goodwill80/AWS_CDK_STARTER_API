import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';
import { Bucket, HttpMethods, IBucket } from 'aws-cdk-lib/aws-s3';
import { ObjectOwnership } from '@aws-sdk/client-s3';

// Here is where you defined and initialise the Dynomo DB table by setting the name, PK, SK...
export class DataStack extends Stack {
  public readonly spacesTable: ITable;
  public readonly photosBucket: IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Get the stack ID
    const suffix = getSuffixFromStack(this);

    // Initialised Dynamo DB Table
    this.spacesTable = new Table(this, 'SpacesTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      tableName: `SpaceTable-${suffix}`,
    });

    // Initialised Photo S3 Bucket - We need to configure the policy in auth stack when creating roles - please see createRoles() in authStack
    this.photosBucket = new Bucket(this, 'SpaceFinder-Photos', {
      bucketName: `space-finder-photos-${suffix}`,
      cors: [
        {
          allowedMethods: [HttpMethods.HEAD, HttpMethods.GET, HttpMethods.PUT],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    });
    // Output the bucket
    new CfnOutput(this, 'SpaceFinderPhotosBucketName', {
      value: this.photosBucket.bucketName,
    });
  }
}
