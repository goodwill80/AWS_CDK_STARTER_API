import { JWT, SignInOutput, signIn } from "@aws-amplify/auth";
import { Amplify } from "aws-amplify";
import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
} from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

// Outdated
const userPoolId = "ap-southeast-1_ZpwsT6ke8";
const UserPoolClientId = "5nfq1nbb1msr5avv13fe0528an";
const identityPoolId = "ap-southeast-1:2b3fb289-779a-4df8-acd9-71a7a3d49894";

// Initialise Amplify API to communicate with AWS cognito - by passing in userPoolID and userIdentityPoolId
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: userPoolId,
      userPoolClientId: UserPoolClientId,
      identityPoolId: identityPoolId,
    },
  },
});

const awsRegion = "ap-southeast-1";

export class AuthService {
  // Login
  public async login(username: string, password: string) {
    const result = (await signIn({
      username,
      password,
      options: {
        authFlowType: "USER_PASSWORD_AUTH",
      },
    })) as SignInOutput;
    return result;
  }

  // Generate Temp credentials for different users
  public async generateTemporaryCredentials(
    jwtToken: string,
    identityId: string
  ) {
    try {
      // const jwtToken = user.accessToken as JWT;
      const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/ap-southeast-1_ZpwsT6ke8`;

      const cognitoIdentity = new CognitoIdentityClient({
        credentials: fromCognitoIdentityPool({
          identityPoolId: identityPoolId,
          logins: {
            [cognitoIdentityPool]: jwtToken,
          },
        }),
      });

      const command = new GetCredentialsForIdentityCommand({
        IdentityId: identityId,
        Logins: {
          [cognitoIdentityPool]: jwtToken,
        },
      });
      const credentials = await cognitoIdentity.send(command);
      return credentials;
    } catch (error) {
      console.log(`❌❌❌: `, error);
    }
  }
}
