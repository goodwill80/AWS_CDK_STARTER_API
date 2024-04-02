import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";

import { Construct } from "constructs";

// Here is where you defined and initialise the Dynomo DB table by setting the name, PK, SK...
export class AuthStack extends Stack {
  private userPool: UserPool;
  private userPoolClient: UserPoolClient;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();
  }

  private createUserPool() {
    this.userPool = new UserPool(this, "SpaceUserPool", {
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true,
      },
    });

    // Print this
    new CfnOutput(this, "SpaceUserPoolId", {
      value: this.userPool.userPoolId,
    });
  }

  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient("SpaceUserPoolClient", {
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
    });

    // Print this
    new CfnOutput(this, "SpaceUserPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
    });
  }
}
