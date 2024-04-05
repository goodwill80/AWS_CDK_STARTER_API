import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient,
} from 'aws-cdk-lib/aws-cognito';
import { CfnUserGroup } from 'aws-cdk-lib/aws-elasticache';
import {
  Effect,
  FederatedPrincipal,
  PolicyStatement,
  Role,
} from 'aws-cdk-lib/aws-iam';
import { CfnIdentity } from 'aws-cdk-lib/aws-pinpointemail';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

interface AuthStackPropsType extends StackProps {
  photosBucket: IBucket;
}

export class AuthStack extends Stack {
  public userPool: UserPool;
  private userPoolClient: UserPoolClient;
  private identifyPool: CfnIdentityPool;
  private authenticatedRole: Role;
  private unauthenticatedRole: Role;
  private adminRole: Role;

  constructor(scope: Construct, id: string, props: AuthStackPropsType) {
    super(scope, id, props);

    this.createUserPool(); // Create user pool for authentication
    this.createUserPoolClient(); // Client to communicate with user pool
    this.createIdentityPool(); // Setting rights to different users i.e. authenticated and unauthenticated
    this.createRole(props.photosBucket); // Used for creating different roles
    this.attachRoles(); // Attached all roles created to identity pool
    this.createAdminGroup(); // Add users as admin
  }

  // Create User Pool
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
      roleArn: this.adminRole.roleArn,
    });
  }

  // Create Identity Pool
  private createIdentityPool() {
    this.identifyPool = new CfnIdentityPool(this, 'SpaceIdentityPool', {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });

    // Output this
    new CfnOutput(this, 'SpaceIdentityPoolId', {
      value: this.identifyPool.ref,
    });
  }

  // Create Roles
  private createRole(photosBucket: IBucket) {
    // Create Authenticated Role
    this.authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': this.identifyPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
    });

    // Create Unauthenticated Role
    this.unauthenticatedRole = new Role(
      this,
      'CognitoDefaultUnauthenticatedRole',
      {
        assumedBy: new FederatedPrincipal(
          'cognito-identity.amazonaws.com',
          {
            StringEquals: {
              'cognito-identity.amazonaws.com:aud': this.identifyPool.ref,
            },
            'ForAnyValue:StringLike': {
              'cognito-identity.amazonaws.com:amr': 'unauthenticated',
            },
          },
          'sts:AssumeRoleWithWebIdentity'
        ),
      }
    );

    // Create Admin Role
    this.adminRole = new Role(this, 'CognitoAdminRole', {
      assumedBy: new FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': this.identifyPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
    });
    this.adminRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          // "s3:ListAllMyBuckets",
          's3:GetObject',
          's3:PutObject',
          's3:PutObjectAcl',
        ],
        resources: [photosBucket.bucketArn + '/*'],
        // resources: ["*"],
      })
    );
  }

  // Attach Roles Created
  private attachRoles() {
    // pass in the identity pool ref, then specify authenticated and unauthenticated role Arn
    new CfnIdentityPoolRoleAttachment(this, 'RolesAttachment', {
      identityPoolId: this.identifyPool.ref,
      roles: {
        authenticated: this.authenticatedRole.roleArn,
        unauthenticated: this.unauthenticatedRole.roleArn,
      },
      roleMappings: {
        adminsMapping: {
          type: 'Token',
          ambiguousRoleResolution: 'AuthenticatedRole',
          identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`,
        },
      },
    });
  }
}

// Activate user in cli
// aws cognito-idp admin-set-user-password --user-pool-id ap-southeast-1_aYY1jWJWI --username xxxxxxx --password "xxxxxx80^^" --permanent
