import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  Code,
  Function as LamdaFunction,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { join } from 'path';

export class LamdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Lamda function for hello get
    new LamdaFunction(this, 'HelloLamda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'hello.main',
      code: Code.fromAsset(join(__dirname, '..', '..', 'services')),
    });
  }
}
