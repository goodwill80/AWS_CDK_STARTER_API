import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  helloLamdaIntergration: LambdaIntegration;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // GET Spaces
    const api = new RestApi(this, "SpacesApi");
    const spacesResource = api.root.addResource("spaces"); // this is the route
    spacesResource.addMethod("GET", props.helloLamdaIntergration);
  }
}

// Control Flow Architecture
// API Gateway (Route & MEthod) => AWS LAMDA Function => Dynamo DB