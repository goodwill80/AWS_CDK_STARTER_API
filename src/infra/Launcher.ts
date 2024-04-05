import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LamdaStack } from "./stacks/LamdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { UIDeploymentStack } from "./stacks/UIDeploymentStack";

const app = new App();
const dataStack = new DataStack(app, "DataStack");
const lamdaStack = new LamdaStack(app, "LamdaStack", {
  spacesTable: dataStack.spacesTable,
});
const authStack = new AuthStack(app, "AuthStack", {
  photosBucket: dataStack.photosBucket,
});
new ApiStack(app, "ApiStack", {
  spacesLamdaIntergration: lamdaStack.spacesLamdaIntergration,
  userPool: authStack.userPool,
});
new UIDeploymentStack(app, "UIDeploymentStack");
