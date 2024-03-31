import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  Code,
  Function as LamdaFunction,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

export class LamdaStack extends Stack {
  public readonly helloLamdaIntergration: LambdaIntegration;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Lamda function for hello get
    const helloLamda = new LamdaFunction(this, 'HelloLamda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'hello.main',
      code: Code.fromAsset(join(__dirname, '..', '..', 'services')),
    });

    this.helloLamdaIntergration = new LambdaIntegration(helloLamda);
  }
}
