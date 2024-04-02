import { Stack, StackProps } from "aws-cdk-lib";

import {
  Code,
  Function as LamdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

interface LamdaStackProps extends StackProps {
  spacesTable: ITable;
}

export class LamdaStack extends Stack {
  public readonly helloLamdaIntergration: LambdaIntegration;
  constructor(scope: Construct, id: string, props: LamdaStackProps) {
    super(scope, id, props);

    // Lamda function for hello get
    // const helloLamda = new LamdaFunction(this, "HelloLamda", {
    //   runtime: Runtime.NODEJS_18_X,
    //   handler: "hello.main",
    //   code: Code.fromAsset(join(__dirname, "..", "..", "services")),
    //   environment: {
    //     TABLE_NAME: props.spacesTable.tableName,
    //   },
    // });

    // Using NodeJS function
    const helloLamda = new NodejsFunction(this, "HelloLamda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: join(__dirname, "..", "..", "services", "hello.ts"),
      environment: {
        TABLE_NAME: props.spacesTable.tableName,
      },
    });

    this.helloLamdaIntergration = new LambdaIntegration(helloLamda);
  }
}
