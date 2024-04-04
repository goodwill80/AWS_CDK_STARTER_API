import { JWT, SignInOutput, signIn } from "@aws-amplify/auth";
import { Amplify } from "aws-amplify";
import {
  CognitoIdentityClient,
  GetCredentialsForIdentityCommand,
} from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
// import { CognitoAuthTokens } from "@aws-amplify/auth/dist/esm/providers/cognito/tokenProvider/types";
// import { UserPool } from "aws-cdk-lib/aws-cognito";

const userPoolId = "ap-southeast-1_aYY1jWJWI";
const UserPoolClientId = "11vaq395nm5liio0e34c1n3q48";
const identityPoolId = "ap-southeast-1:9de2ef39-da6e-4b5c-a6c2-18cfe3f7d555";

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
      const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/ap-southeast-1_aYY1jWJWI`;

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
