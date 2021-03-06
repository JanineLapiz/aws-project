import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/lib/aws-apigateway";
import { GenericTable } from "./GenericTable";
import { NodejsFunction } from "aws-cdk-lib/lib/aws-lambda-nodejs";
import { PolicyStatement } from "aws-cdk-lib/lib/aws-iam";

export class SpaceStack extends cdk.Stack {
  private api = new RestApi(this, "SpaceApi");
  private spaceTable = new GenericTable({
    name: "SpaceTable",
    primaryKey: "SpaceId",
    stack: this,
  });

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const helloLambdaNodeJs = new NodejsFunction(this, "helloLambdaNodeJs", {
      entry: join(__dirname, "..", "services", "node-lambda", "hello.ts"),
      handler: "handler",
    });

    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions("s3:ListAllMyBuckets");
    s3ListPolicy.addResources("*");
    helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);

    // Hello API Lambda integration:
    const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
    const helloLambdaResource = this.api.root.addResource("hello");
    helloLambdaResource.addMethod("GET", helloLambdaIntegration);
  }
}
