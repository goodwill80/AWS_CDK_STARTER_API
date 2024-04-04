import { Stack, StackProps } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  MethodOptions,
  ResourceOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { IUserPool, UserPool } from "aws-cdk-lib/aws-cognito";

interface ApiStackProps extends StackProps {
  spacesLamdaIntergration: LambdaIntegration;
  userPool: IUserPool;
}

// This API stack handles routing and HTTP method
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "SpacesApi");

    // initialize CognitoUserPoolsAuthorizer
    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "SpaceApiAuthorizer",
      {
        cognitoUserPools: [props.userPool],
        identitySource: "method.request.header.Authorization",
      }
    );

    // Attached the api to it
    authorizer._attachToApi(api);

    // Create options with authorisation params - ADD to specific Methods which require authorization
    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };

    // Create options with CORs params - ADD to API RESOURCE
    const optionsWithCORs: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    };

    const spacesResource = api.root.addResource("spaces", optionsWithCORs); // this is the route
    spacesResource.addMethod(
      "GET",
      props.spacesLamdaIntergration, //Linked with Lambda function
      optionsWithAuth // authorization
    ); // GET Method
    spacesResource.addMethod(
      "POST",
      props.spacesLamdaIntergration,
      optionsWithAuth
    ); // POST Method
    spacesResource.addMethod(
      "DELETE",
      props.spacesLamdaIntergration,
      optionsWithAuth
    ); // DELETE Method
    spacesResource.addMethod(
      "PUT",
      props.spacesLamdaIntergration,
      optionsWithAuth
    ); // PUT Method
  }
}

// Control Flow Architecture
// API Gateway (Route & MEthod) => AWS LAMDA Function => Dynamo DB
