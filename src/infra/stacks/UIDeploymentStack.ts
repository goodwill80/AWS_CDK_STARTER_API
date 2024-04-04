import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../Utils";
import { join } from "path";
import { existsSync } from "fs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";

export class UIDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // 1. Obtain the Stack ID upon initialisation of stack
    const suffix = getSuffixFromStack(this);

    // 2. Create new S3 bucket upon initialisation
    const deploymentBucket = new Bucket(this, "UIDeploymentBucket", {
      bucketName: "space-finder-client",
    });

    // 3. Define the path where the UI files (i.e. index.html) are found
    const uiDir = join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "AWS_CDK_START_API_CLIENT",
      "dist"
    );

    // 4. Check if dir exist
    if (!existsSync(uiDir)) {
      console.warn("UI directory not found " + uiDir);
      return;
    }

    // 5. Bucket Deployment to AWS by passing in the bucket created above as well as the path to your assets
    new BucketDeployment(this, "SpaceFinderDeployment", {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)],
    });

    // 6. Create an origin identity - which is a right to read from the bucket, then grant it to the bucketDeployment
    const originIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIDentity"
    );
    deploymentBucket.grantRead(originIdentity);

    // 7. Create a distribution
    const distribution = new Distribution(this, "SpaceFinderDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originIdentity,
        }),
      },
    });

    // To output the URL
    new CfnOutput(this, "SpaceFinderURL", {
      value: distribution.distributionDomainName,
    });
  }
}
