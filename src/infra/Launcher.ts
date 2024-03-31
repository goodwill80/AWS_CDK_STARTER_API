import { App } from 'aws-cdk-lib';
import { DataStack } from './stacks/DataStack';
import { LamdaStack } from './stacks/LamdaStack';

const app = new App();
new DataStack(app, 'DataStack');
new LamdaStack(app, 'LamdaStack');
