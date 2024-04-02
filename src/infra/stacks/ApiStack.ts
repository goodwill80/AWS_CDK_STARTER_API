import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
  spacesLamdaIntergration: LambdaIntegration;
}

// This API stack handles routing and HTTP method
export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "SpacesApi");
    const spacesResource = api.root.addResource("spaces"); // this is the route
    spacesResource.addMethod("GET", props.spacesLamdaIntergration); // GET Method
    spacesResource.addMethod("POST", props.spacesLamdaIntergration); // POST Method
    spacesResource.addMethod("DELETE", props.spacesLamdaIntergration); // DELETE Method
    spacesResource.addMethod("PUT", props.spacesLamdaIntergration); // DELETE Method
  }
}

// Control Flow Architecture
// API Gateway (Route & MEthod) => AWS LAMDA Function => Dynamo DB
