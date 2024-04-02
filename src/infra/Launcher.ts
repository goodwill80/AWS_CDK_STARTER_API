import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LamdaStack } from "./stacks/LamdaStack";
import { ApiStack } from "./stacks/ApiStack";

const app = new App();
const dataStack = new DataStack(app, "DataStack");
const lamdaStack = new LamdaStack(app, "LamdaStack", {
  spacesTable: dataStack.spacesTable,
});
new ApiStack(app, "ApiStack", {
  spacesLamdaIntergration: lamdaStack.spacesLamdaIntergration,
});
