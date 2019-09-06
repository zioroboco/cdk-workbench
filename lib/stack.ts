import * as cdk from "@aws-cdk/core"

export class Stack extends cdk.Stack {
  constructor(app: cdk.App, id: string, props: cdk.StackProps) {
    super(app, id, props)
  }
}
