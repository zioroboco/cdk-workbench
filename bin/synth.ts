import { App, Environment } from "@aws-cdk/core"
import { Stack, StackProps } from "../lib/stack"

const stackId = "cdk-workbench"

const personalAccount: Environment = {
  account: "203242799745",
  region: "ap-southeast-2",
}

const stackProps: StackProps = {
  bucketName: `${stackId}-website`,
  domainName: `${stackId}.ziorobo.co`,
  acmCertRef: `arn:aws:acm:us-east-1:203242799745:certificate/97978590-a0d3-4584-aa59-daed83e6e520`,
  env: personalAccount,
}

const app = new App()
new Stack(app, stackId, stackProps)
app.synth()
