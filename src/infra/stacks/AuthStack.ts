import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import {
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient,
} from 'aws-cdk-lib/aws-cognito';
import { CfnUserGroup } from 'aws-cdk-lib/aws-elasticache';

import { Construct } from 'constructs';

// Here is where you defined and initialise the Dynomo DB table by setting the name, PK, SK...
export class AuthStack extends Stack {
  public userPool: UserPool;
  private userPoolClient: UserPoolClient;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();
    this.createAdminGroup();
  }

  private createUserPool() {
    this.userPool = new UserPool(this, 'SpaceUserPool', {
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true,
      },
    });

    // Output this
    new CfnOutput(this, 'SpaceUserPoolId', {
      value: this.userPool.userPoolId,
    });
  }

  // Add aws client to userpool
  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient('SpaceUserPoolClient', {
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
    });

    // Output this
    new CfnOutput(this, 'SpaceUserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
    });
  }

  // Set up an admin group of users with special access
  private createAdminGroup() {
    new CfnUserPoolGroup(this, 'SpaceAdmins', {
      userPoolId: this.userPool.userPoolId,
      groupName: 'admin',
    });
  }
}

// Activate user in cli
// aws cognito-idp admin-set-user-password --user-pool-id ap-southeast-1_aYY1jWJWI --username xxxxxxx --password "xxxxxx80^^" --permanent